export interface IDataGapper {
  'Ticker': string,
  'Day 1 Date': Date;
  'Day 1 PM Vol': number;
  'Day 1 Gap %': number;
  'Day 1 Vol': number;
  'Day 1 High Time': string;
  'Day 1 Low Time': string;
  'Day 1 PM High': number;
  'Day 1 PM Low': number;
  'Day 1 3Min High': number;
  'Day 1 5Min High': number;
  'Day 1 15Min High': number;
  'Day 1 30Min High': number;
  'Day 1 60Min High': number;
  'Day 1 90Min High': number;
  'Day 1 120Min High': number;
  'Day 1 3Min Low': number;
  'Day 1 5Min Low': number;
  'Day 1 15Min Low': number;
  'Day 1 30Min Low': number;
  'Day 1 60Min Low': number;
  'Day 1 90Min Low': number;
  'Day 1 120Min Low': number;
  'Day 1 High': number;
  'Day 1 Low': number;
  'Day 1 Open': number;
  'Day 1 Close': number;
  'Day 1 3Min Close': number;
  'Day 1 5Min Close': number;
  'Day 1 15Min Close': number;
  'Day 1 30Min Close': number;
  'Day 1 60Min Close': number;
  'Day 1 90Min Close': number;
  'Day 1 120Min Close': number;
  'Day -1 Close': number;
  'Industry': string;
  'Sector': string;
  'Market Cap': string;
  'Float': string,
}

export interface IDataGapperUploadExtended extends IDataGapper {
  id: string;
  'pmh-open%'?: number;
  'Closed Status'?: 'Closed Red' | 'Closed Green';
  'Profit/Loss'?: number;
  'equity'?: number;
}

export enum IDataGapperUploadExtendedFields {
  'Ticker' = 'Ticker',
  'Day 1 Date' = 'Day 1 Date',
  'Day 1 PM Vol' = 'Day 1 PM Vol',
  'Day 1 Gap %' = 'Day 1 Gap %',
  'Day 1 Vol' = 'Day 1 Vol',
  'Day 1 High Time' = 'Day 1 High Time',
  'Day 1 Low Time'='Day 1 Low Time',
  'Day 1 PM High' = 'Day 1 PM High',
  'Day 1 PM Low' = 'Day 1 PM Low',
  'Day 1 3Min High' = 'Day 1 3Min High',
  'Day 1 5Min High' = 'Day 1 5Min High',
  'Day 1 15Min High' = 'Day 1 15Min High',
  'Day 1 30Min High' = 'Day 1 30Min High',
  'Day 1 60Min High' = 'Day 1 60Min High',
  'Day 1 90Min High' = 'Day 1 90Min High',
  'Day 1 120Min High' = 'Day 1 120Min High',
  'Day 1 3Min Low' = 'Day 1 3Min Low',
  'Day 1 5Min Low' = 'Day 1 5Min Low',
  'Day 1 15Min Low' = 'Day 1 15Min Low',
  'Day 1 30Min Low' = 'Day 1 30Min Low',
  'Day 1 60Min Low' = 'Day 1 60Min Low',
  'Day 1 90Min Low' = 'Day 1 90Min Low',
  'Day 1 120Min Low' = 'Day 1 120Min Low',
  'Day 1 High' = 'Day 1 High',
  'Day 1 Low' = 'Day 1 Low',
  'Day 1 Open' = 'Day 1 Open',
  'Day 1 Close' = 'Day 1 Close',
  'Day 1 3Min Close' = 'Day 1 3Min Close',
  'Day 1 5Min Close' = 'Day 1 5Min Close',
  'Day 1 15Min Close' = 'Day 1 15Min Close',
  'Day 1 30Min Close' = 'Day 1 30Min Close',
  'Day 1 60Min Close' = 'Day 1 60Min Close',
  'Day 1 90Min Close' = 'Day 1 90Min Close',
  'Day 1 120Min Close' = 'Day 1 120Min Close',
  'Day -1 Close' = 'Day -1 Close',
  'Industry' = 'Industry',
  'Sector' = 'Sector',
  'Market Cap' = 'Market Cap',
  'Float' = 'Float',
  'pmh-open%' = 'pmh-open%',
  'Closed Status' = 'Closed Status',
  'Profit/Loss' = 'Profit/Loss',
  'Equity' = 'Equity'
}
