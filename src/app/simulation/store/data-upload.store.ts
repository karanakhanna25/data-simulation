import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate as ISimulationDataState } from "./data-upload.state";
import { map, Observable, switchMap, tap } from "rxjs";
import {uniq} from 'lodash';
import { FirebaseService } from "@app-simulation/services/firebase.service";
import { calculatePnl } from "@app-simulation/utils/pnl-calculations.utils";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

@Injectable()
export class SimulationDataStore extends ComponentStore<ISimulationDataState> {

  readonly gusData = this.selectSignal(state => state.gus.map(g => ({
    ...g,
    "pmh-open%": this._calculateDistanceOpenPmh(g["Day 1 Open"], g["Day 1 PM High"]),
    "Closed Status": g["Day 1 Open"] > g["Day 1 Close"] ? 'Closed Red' : 'Closed Green'
  })));

  readonly equity = this.selectSignal(state => state.visibleRows.map(g => g.Equity));

  readonly config = this._configStore.simulationEngineConfig;

  readonly allIndustries = this.selectSignal(state => uniq(state.gus.map(g => g.Industry)));
  readonly allSectors = this.selectSignal(state => uniq(state.gus.map(g => g.Sector)));

  readonly updateGUSRecords = this.updater((state,  gus: IDataGapperUploadExtended[]) => ({
    ...state,
    gus
  }))

  readonly setVisibleRows = this.updater((state, visibleRows: IDataGapperUploadExtended[]) => ({
    ...state,
    visibleRows
  }))

  constructor(private _firebaseService: FirebaseService, private _configStore: SimulationEngineConfigStore) {
    super(dataUploadInitialState)
  }

  readonly uploadGusData = this.effect((trigger$: Observable<{data: IDataGapperUploadExtended[], context: string}>) =>
    trigger$.pipe(
      switchMap(({data, context}) => this._firebaseService.retrieveRecords().pipe(map((allRecords) => ({
        allRecords, data, context
      }))).pipe(
        switchMap(({data, allRecords, context}) => {
          const contextData = ((allRecords || {})[context as keyof typeof allRecords] || []) as IDataGapperUploadExtended[];
          const mergedContextData = contextData.length ? this._mergeRecords(contextData, data, 'append') : data;
          const newRecord = {
            [context]: mergedContextData
          };
          const allData = {...allRecords, ...newRecord};
          return  this._firebaseService.addStrategyRecords(allData).pipe(
            tap((data) => this.updateGUSRecords(data))
          )
        }),
      )),
    )
  )

  readonly runPnlCalculations = this.effect((trigger$: Observable<IDataGapperUploadExtended[]>) =>
    trigger$.pipe(
    map(data => calculatePnl(this.config(), data)),
      tap(data => {
        this.setVisibleRows(data);
        this.updateGUSRecords(this._mergeRecords(this.gusData() as IDataGapperUploadExtended[], data, 'update'));
      })
    )
  )

  readonly loadGUSData = this.effect((trigger$: Observable<string>) =>
    trigger$.pipe(
      switchMap((context) => this._firebaseService.retrieveRecords().pipe(
        tap(data => {
          this.updateGUSRecords(data[context]);
        })
      )),
    )
  )

  private _calculateDistanceOpenPmh(open: number, pmh: number): number {
    return Number(((pmh-open)/open*100).toFixed(2));
  }

  private _mergeRecords(allRecords: IDataGapperUploadExtended[], newRecords: IDataGapperUploadExtended[], type:'append' | 'update'): IDataGapperUploadExtended[] {
    if (type === 'append') {
      return [...allRecords, ...newRecords];
    } else {
      return (allRecords || []).map(d => {
        const record = newRecords.find(s => s.id === d.id);
        if (record?.id) {
          return record
        }
        return d;
      })
    }
  }

}
