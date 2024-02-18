export interface ISimulationEngineConfig {
  equity: number,
  entry_slippage: number,
  exit_slippage: number,
  locate: number,
  cappedRisk: number,
  riskTimeFrame: number,
  risk_from: string,
  wiggle_room: number,
  max_loss_risk_percent: number,
  locate_offset: number,
  enter_at: string,
  spike_percent_to_enter: number,
  pyramid: string,
  no_extra_locates: boolean,
  exit_lows?: number,
  shares_exit_close: number,
  shares_exit_lows: number,
  max_loss_spike_percent: number,
  shares_exit_time: number,
  exit_at_time: string
}


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
  'Equity'?: number;
  'Open-High Spike%': number,
  'Open wrt to Fib': 'Between' | 'Under' | 'Above' | undefined,
  '60Min Close < Open': 1 | 0,
  '30Min Close < Open': 1 | 0,
  'Broke 11am High': 1 | 0,
  '60Min High > 30Min High': 1 | 0,
  'Inst Own': number,
  'Broke 10:30am High': 1 | 0,
  'Broke 10am High': 1 | 0,
  'Broke 9:45am High': 1 | 0,
  'Broke 9:35am High': 1 | 0
  '10am close < open' : 1 | 0
  'spike % 9:45am': number,
  '10am close - open dist': number,
  '9:45am close < open': 1 | 0,
  'gap until pmh': number,
  'Broke PMH': 1 | 0
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
  'Equity' = 'Equity',
  'Open-High Spike%' = 'Open-High Spike%',
  'Open wrt to Fib' = 'Open wrt to Fib',
  '60Min Close < Open' = '60Min Close < Open',
  '30Min Close < Open' = '30Min Close < Open',
  'Broke 10am High' = 'Broke 10am High',
  'Broke 10:30am High' = 'Broke 10:30am High',
  'Broke 11am High' = 'Broke 11am High',
  'Broke 9:35am High' = 'Broke 9:35am High',
  'Broke 9:45am High' = 'Broke 9:45am High',
  '60Min High > 30Min High' = '60Min High > 30Min High',
  'Inst Own' = 'Inst Own',
  '9:45am close < open' = '9:45am close < open',
  '10am close < open' = '10am close < open',
  'spike % 9:45am' = 'spike % 9:45am',
  '10am close - open dist' = '10am close - open dist',
  'gap until pmh' = 'gap until pmh',
  'Broke PMH' = 'Broke PMH'
}
