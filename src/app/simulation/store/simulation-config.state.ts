import { ISimulationEngineConfig } from "@app-simulation/simulation.model"

export interface ISimulationEngineConfigState {
  config: ISimulationEngineConfig;
  filter: {[key: string]: any};
}

export const simulationEngineConfigInitialState = {
  config: {
    equity: 30000,
    entry_slippage: 3,
    exit_slippage: 2,
    locate: 2,
    cappedRisk: 25000,
    riskTimeFrame: 90,
    risk_from: 'risk from 0.886 Fib level',
    wiggle_room: 5,
    max_loss_risk_percent: 10,
    locate_offset: 2,
    enter_at: '0.786 fib or push from open',
    spike_percent_to_enter: 0,
    pyramid: '10:30am + 11am combo',
    no_extra_locates: true,
    first_exit_close: true,
    shares_exit_close: 100,
    shares_exit_lows: 0,
    max_loss_spike_percent: 55,
  },
  filter: {}
}
