import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model";
import { Observable } from "rxjs";
import { IPolygonMinuteData } from "./polygon.model";

const API_KEY = 'L17kBpqoRSuhspPoj0Bk6hz8wdZxrQq4'

@Injectable()
export class PolygonService {

  url: string = 'https://quant-sim-default-rtdb.firebaseio.com/quant-sim-database.json'

  private _headers = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private _http: HttpClient) { }

  getIntradayData(stockSymbol: string, date: string): Observable<IPolygonMinuteData> {
    const url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/minute/${date}/${date}?apiKey=${API_KEY}`;
    return this._http.get<IPolygonMinuteData>(url);
  }
}
