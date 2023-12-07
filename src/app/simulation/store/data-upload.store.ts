import { computed, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate as ISimulationDataState } from "./data-upload.state";
import { map, Observable, switchMap, tap } from "rxjs";
import { FirebaseService } from "@app-simulation/services/firebase.service";
import { calculatePnl } from "@app-simulation/utils/pnl-calculations.utils";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

@Injectable()
export class SimulationDataStore extends ComponentStore<ISimulationDataState> {

  readonly gusData = this.selectSignal(state => (state.allRecords || []).map(g => ({
    ...g,
    "pmh-open%": this._calculateDistanceOpenPmh(g["Day 1 Open"], g["Day 1 PM High"]),
    "Closed Status": g["Day 1 Open"] > g["Day 1 Close"] ? 'Closed Red' : 'Closed Green'
  })));

  readonly equity = this.selectSignal(state => [...[this._configStore.simulationEngineConfig().equity], ...state.visibleRows.map(g => g.Equity)]);
  readonly config = this._configStore.simulationEngineConfig;

  readonly visibleRows = this.selectSignal(state => state.visibleRows);
  readonly closedRedCount = this.selectSignal(state => state.visibleRows.filter(r => r['Day 1 Open'] > r['Day 1 Close']));
  readonly closedRedPercent = computed(() => Number(((this.closedRedCount().length)/((this.visibleRows() || []).length) * 100).toFixed(2)))

  readonly updateGUSRecords = this.updater((state,  gus: IDataGapperUploadExtended[]) => ({
    ...state,
    allRecords: gus
  }))

  readonly setVisibleRows = this.updater((state, visibleRows: IDataGapperUploadExtended[]) => ({
    ...state,
    visibleRows
  }))

  constructor(private _firebaseService: FirebaseService, private _configStore: SimulationEngineConfigStore) {
    super(dataUploadInitialState)
  }

  readonly uploadGusData = this.effect((trigger$: Observable<{data: IDataGapperUploadExtended[], context: string, type: 'append' | 'update' | 'replace'}>) =>
    trigger$.pipe(
      switchMap(({data, context, type}) => this._firebaseService.retrieveRecords().pipe(map((allRecords) => ({
        allRecords, data, context, type
      }))).pipe(
        switchMap(({data, allRecords, context, type}) => {
          const contextData = ((allRecords || {})[context as keyof typeof allRecords] || []) as IDataGapperUploadExtended[];
          const mergedContextData = contextData.length ? this._mergeRecords(contextData, data, type) : data;
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

  private _mergeRecords(allRecords: IDataGapperUploadExtended[], newRecords: IDataGapperUploadExtended[], type:'append' | 'update' | 'replace'): IDataGapperUploadExtended[] {
    if (type === 'append') {
      return [...allRecords, ...newRecords];
    } else if(type === 'update') {
      return (allRecords || []).map(d => {
        const record = newRecords.find(s => s.id === d.id);
        if (record?.id) {
          return record
        }
        return d;
      })
    } else {
      return newRecords;
    }
  }

}
