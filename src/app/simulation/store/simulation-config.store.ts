import { ComponentStore } from "@ngrx/component-store";
import { ISimulationEngineConfigState, simulationEngineConfigInitialState } from "./simulation-config.state";
import { Injectable } from "@angular/core";
import { ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { getFilterExpression } from "@app-simulation/filter-chip-utils";

@Injectable()
export class SimulationEngineConfigStore extends ComponentStore<ISimulationEngineConfigState> {

  readonly simulationEngineConfig = this.selectSignal(state => state.config)
  readonly simulationEngineConfig$ = this.select(state => state.config);
  readonly filterText = this.selectSignal(state => getFilterExpression(state.filter));
  readonly filter$ = this.select(state => state.filter);

  readonly updateSimulationConfig = this.updater((state, config: ISimulationEngineConfig) => ({
    ...state,
    config
  }));

  readonly updateFilter = this.updater((state, filter: {[key:string]: any}) => ({
    ...state, filter
  }))

  constructor() {
    super(simulationEngineConfigInitialState);
  }
}
