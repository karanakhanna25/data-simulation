import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate } from "./data-upload.state";
import { Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model";
import {uniq} from 'lodash';
import { FirebaseService } from "@app-data-upload/services/firebase.service";

@Injectable()
export class DataUploadStore extends ComponentStore<IDataUploadSate> {

  readonly gusData = this.selectSignal(state => state.gus.map(g => ({
    ...g,
    "pmh-open%": this._calculateDistanceOpenPmh(g["Day 1 Open"], g["Day 1 PM High"])
  })));
  readonly allIndustries = this.selectSignal(state => uniq(state.gus.map(g => g.Industry)));
  readonly allSectors = this.selectSignal(state => uniq(state.gus.map(g => g.Sector)));

  readonly updateGusRecords = this.updater((state, gus: IDataGapperUploadExtended[]) => ({
    ...state,
    gus
  }))

  constructor(private _firebaseService: FirebaseService) {
    super(dataUploadInitialState)
  }

  readonly uploadGusData = this.effect((trigger$: Observable<IDataGapperUploadExtended[]>) =>
    trigger$.pipe(
      switchMap(data => this._firebaseService.addGUSRecords(data).pipe(
        tap((data) => this.updateGusRecords(data))
      )),
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

}
