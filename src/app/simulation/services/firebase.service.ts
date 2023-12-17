import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseService {

  url: string = 'https://quant-sim-default-rtdb.firebaseio.com/quant-sim-database.json'

  private _headers = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private _http: HttpClient) { }

  addStrategyRecords(records: {[key: string]: any}): Observable<IDataGapperUploadExtended[]> {

    return this._http.put<IDataGapperUploadExtended[]>(this.url, records, {headers: this._headers});
  }

  retrieveRecords(): Observable<{[key: string]: any}> {
   return this._http.get<{[key: string]: any}>(this.url)
  }

}
