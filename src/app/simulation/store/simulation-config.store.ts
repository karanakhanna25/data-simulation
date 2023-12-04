import { ComponentStore } from "@ngrx/component-store";
import { ISimulationEngineConfigState, simulationEngineConfigInitialState } from "./simulation-config.state";
import { Injectable } from "@angular/core";
import { ISimulationEngineConfig } from "@app-simulation/simulation.model";

@Injectable()
export class SimulationEngineConfigStore extends ComponentStore<ISimulationEngineConfigState> {

  readonly simulationEngineConfig = this.selectSignal(state => state.config)
  readonly simulationEngineConfig$ = this.select(state => state.config);

  readonly updateSimulationConfig = this.updater((state, config: ISimulationEngineConfig) => ({
    ...state,
    config
  }))

  constructor() {
    super(simulationEngineConfigInitialState);
  }
}
