import { ISimulationEngineConfig } from "@app-simulation/simulation.model"

export interface ISimulationEngineConfigState {
  config: ISimulationEngineConfig;
  filter: {[key: string]: any};
}

export const simulationEngineConfigInitialState = {
  config: {
    equity: 30000,
    slippage: 3,
    locate: 2,
    cappedRisk: 25000,
    riskTimeFrame: 90,
    first_risk: 10,
    first_entry_spike: 0,
    first_exit_close: true,
    risk_from_open: false,
    shares_exit_close: 100,
    shares_exit_lows: 0,
    wiggle_room: 5,
    spike_percent_risk: 55
  },
  filter: {}
}
