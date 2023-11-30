import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDataGapperUpload } from "@app-data-upload/data-upload.model";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseService {

  url: string = 'https://quant-sim-default-rtdb.firebaseio.com/quant-sim-database.json'

  private _headers = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private _http: HttpClient) { }

  addGUSRecords(records: IDataGapperUpload[]): Observable<IDataGapperUpload[]> {
    return this._http.put<IDataGapperUpload[]>(this.url, records, {headers: this._headers});
  }

  retrieveGUSRecords(): Observable<IDataGapperUpload[]> {
   return this._http.get<IDataGapperUpload[]>(this.url)
  }
}
