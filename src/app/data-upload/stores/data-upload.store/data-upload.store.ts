import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { dataUploadInitialState, IDataUploadSate } from "./data-upload.state";
import { map, Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { IDataGapperUpload } from "@app-data-upload/data-upload.model";
import {uniqBy} from 'lodash';
import { FirebaseService } from "@app-data-upload/services/firebase.service";

@Injectable()
export class DataUploadStore extends ComponentStore<IDataUploadSate> {

  readonly gusData$ = this.select(state => state.gus);

  readonly updateGusRecords = this.updater((state, gus: IDataGapperUpload[]) => ({
    ...state,
    gus
  }))

  constructor(private _firebaseService: FirebaseService) {
    super(dataUploadInitialState)
  }

  readonly uploadGusData = this.effect((trigger$: Observable<IDataGapperUpload[]>) =>
    trigger$.pipe(
      withLatestFrom(this.gusData$),
      map(([newData, prevData]) => this._generateUniqDataSet(prevData, newData)),
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

  private _generateUniqDataSet(prevData: IDataGapperUpload[], newData: IDataGapperUpload[]): IDataGapperUpload[] {
    return uniqBy([...(prevData || []), ...(newData || [])], 'id');
  }

}
