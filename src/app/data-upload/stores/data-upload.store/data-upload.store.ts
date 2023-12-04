import { Inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate as ISimulationDataState } from "./data-upload.state";
import { map, Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model";
import {uniq} from 'lodash';
import { FirebaseService } from "@app-data-upload/services/firebase.service";
import { calculatePnl } from "@app-simulation/utils/pnl-calculations.utils";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";

@Injectable()
export class SimulationDataStore extends ComponentStore<ISimulationDataState> {

  readonly gusData = this.selectSignal(state => state.gus.map(g => ({
    ...g,
    "pmh-open%": this._calculateDistanceOpenPmh(g["Day 1 Open"], g["Day 1 PM High"]),
    "Closed Status": g["Day 1 Open"] > g["Day 1 Close"] ? 'Closed Red' : 'Closed Green'
  })));

  readonly config = this._configStore.simulationEngineConfig;

  readonly allIndustries = this.selectSignal(state => uniq(state.gus.map(g => g.Industry)));
  readonly allSectors = this.selectSignal(state => uniq(state.gus.map(g => g.Sector)));

  readonly updateGusRecords = this.updater((state, gus: IDataGapperUploadExtended[]) => ({
    ...state,
    gus
  }))

  constructor(private _firebaseService: FirebaseService, private _configStore: SimulationEngineConfigStore) {
    super(dataUploadInitialState)
  }

  readonly uploadGusData = this.effect((trigger$: Observable<IDataGapperUploadExtended[]>) =>
    trigger$.pipe(
      switchMap(data => this._firebaseService.addGUSRecords(data).pipe(
        tap((data) => this.updateGusRecords(data))
      )),
    )
  )

  readonly runPnlCalculations = this.effect((trigger$: Observable<IDataGapperUploadExtended[]>) =>
    trigger$.pipe(
    map(data => calculatePnl(this.config(), data)),
      tap(data => this.updateGusRecords(this._mergeRecords(this.gusData() as IDataGapperUploadExtended[], data)))
    )
  )

  readonly loadData = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      switchMap(() => this._firebaseService.retrieveGUSRecords().pipe(
        tap(data => this.updateGusRecords(data))
      )),
    )
  )

  private _calculateDistanceOpenPmh(open: number, pmh: number): number {
    return Number(((open-pmh)/open*100).toFixed(2));
  }

  private _mergeRecords(allRecords: IDataGapperUploadExtended[], subRecords: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
    return allRecords.map(d => {
      const record = subRecords.find(s => s.id === d.id);
      if (record?.id) {
        return record
      }
      return d;
    })
  }

}
