export interface IPolygonMinuteData {
  ticker: string;
  queryCount:number;
  resultsCount: number;
  adjusted: true;
  results: IPolygonMinuteDataResults[];
}

export interface IPolygonMinuteDataResults {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number
}
