export interface ISimulationEngineConfig {
  equity: number,
  slippage: number,
  locate: number,
  cappedRisk?: number,
  riskTimeFrame: number,
  wiggle_room: number,
  first_risk: number,
  first_entry_spike: number,
  first_open_size: boolean,
  exit_lows?: number,
  shares_exit_close: number,
  shares_exit_lows: number
}
