import { ISimulationEngineConfig } from "@app-simulation/simulation.model"

export interface ISimulationEngineConfigState {
  config: ISimulationEngineConfig;
}

export const simulationEngineConfigInitialState = {
  config: {
    equity: 30000,
    slippage: 3,
    locate: 4,
    riskTimeFrame: 90,
    first_risk: 10,
    first_entry_spike: 0,
    first_exit_close: true,
    first_open_size: false,
    shares_exit_close: 100,
    shares_exit_lows: 0,
    wiggle_room: 3,
    spike_percent_risk: 55
  }
}
