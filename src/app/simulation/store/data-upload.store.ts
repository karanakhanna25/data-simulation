import { computed, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate as ISimulationDataState } from "./data-upload.state";
import { map, Observable, switchMap, tap } from "rxjs";
import { FirebaseService } from "@app-simulation/services/firebase.service";
import { calculatePnl } from "@app-simulation/utils/pnl-calculations.utils";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { IDataGapperUploadExtended, IDataGapperUploadExtendedFields } from "@app-simulation/simulation.model";
import { extractFibLevel, getOpenRelativeToFibLevel } from "@app-simulation/utils/common.utils";

@Injectable()
export class SimulationDataStore extends ComponentStore<ISimulationDataState> {

  readonly gusData = this.selectSignal(state => (this._filterBrokenTickers(state.allRecords || [])));
  readonly gusData$ = this.select(state => (this._filterBrokenTickers(state.allRecords || [])));

  readonly equity = this.selectSignal(state => [...[this._configStore.simulationEngineConfig().equity], ...state.visibleRows.map(g => g.Equity)]);
  readonly config = this._configStore.simulationEngineConfig;

  readonly visibleRows = this.selectSignal(state => state.visibleRows);
  readonly closedRedCount = this.selectSignal(state => state.visibleRows.filter(r => r['Day 1 Open'] > r['Day 1 Close']));
  readonly closedRedPercent = computed(() => Number(((this.closedRedCount().length)/((this.visibleRows() || []).length) * 100).toFixed(2)))

  readonly updateGUSRecords = this.updater((state,  gus: IDataGapperUploadExtended[]) => ({
    ...state,
    allRecords: this._addCalculatedFields(gus)
  }))

  readonly setVisibleRows = this.updater((state, visibleRows: IDataGapperUploadExtended[]) => ({
    ...state,
    visibleRows: this._addCalculatedFields(visibleRows)
  }));

  readonly resetPnl = this.updater((state) => ({
    ...state,
    allRecords: this._resetPnl(state.allRecords)
  }));

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
      tap(() => {
        this.resetPnl();
      }),
    map(data => this._resetPnl(data)),
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

  private _resetPnl(data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
    return data.map(d => ({...d,
      [IDataGapperUploadExtendedFields["Profit/Loss"]]: undefined,
      [IDataGapperUploadExtendedFields.Equity]: undefined
    }))
  }

  private _calculateDistanceOpenPmh(open: number, pmh: number): number {
    return Number(((pmh-open)/pmh*100).toFixed(2));
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

  private _addCalculatedFields(data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
    if (data) {
      return (data || []).map(g => ({
        ...g,
        "pmh-open%": this._calculateDistanceOpenPmh(g["Day 1 Open"], g["Day 1 PM High"]),
        "Closed Status": g["Day 1 Open"] > g["Day 1 Close"] ? 'Closed Red' : 'Closed Green',
        'Open-High Spike%': Number(((g["Day 1 High"] - g["Day 1 Open"])/g["Day 1 Open"]*100).toFixed(2)),
        'Open wrt to Fib': getOpenRelativeToFibLevel(g),
        '60Min Close < Open': g["Day 1 60Min Close"] < g["Day 1 Open"] ? 1 : 0,
        '30Min Close < Open': g["Day 1 30Min Close"] < g["Day 1 Open"] ? 1 : 0,
        'Broke 11am High': g["Day 1 High"] > g["Day 1 90Min High"] ? 1 : 0,
        '60Min High > 30Min High': g["Day 1 60Min High"] > g["Day 1 30Min High"] ? 1 : 0,
        'Broke 10:30am High': g["Day 1 High"] > g["Day 1 60Min High"] ? 1 : 0,
        "Broke 9:35am High": g["Day 1 High"] > g["Day 1 5Min High"] ? 1 : 0,
        "Broke 9:45am High" : g["Day 1 High"] > g["Day 1 15Min High"] ? 1 : 0,
        '10am close < open': g["Day 1 30Min Close"] < g["Day 1 Open"] ? 1 : 0,
        '10am close - open dist': Number(((g["Day 1 30Min Close"] - g["Day 1 Open"])/g["Day 1 Open"]*100).toFixed(2)),
        'spike % 9:45am': Number(((g["Day 1 15Min High"] - g["Day 1 Open"])/g["Day 1 Open"]*100).toFixed(2)),
        'Broke 10am High': g["Day 1 High"] > g["Day 1 30Min High"] ? 1 : 0,
        '9:45am close < open': g["Day 1 15Min Close"] < g["Day 1 Open"] ? 1 : 0,
        'gap until pmh': Number((((g["Day 1 PM High"] - g["Day -1 Close"])/g["Day -1 Close"])*100).toFixed(2)),
        'Broke PMH': g["Day 1 High"] > g["Day 1 PM High"] ? 1 : 0
      }))
    }
    return [];

  }

  private _filterBrokenTickers(data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
    const ignoreIds = ['2023-12-01-NEXI']
    return data.filter(d => !ignoreIds.includes(d.id));
  }
}
