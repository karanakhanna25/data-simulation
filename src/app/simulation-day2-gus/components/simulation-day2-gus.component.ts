import { Component } from "@angular/core";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";

@Component({
  selector: 'simulation-day2-gus',
  templateUrl: 'simulation-day2-gus.component.html',
  styleUrl: 'simulation-day2-gus.component.scss',
  providers: [SimulationDataStore, SimulationEngineConfigStore]
})
export class SimulationDay2GUSComponent  {

  constructor(private _store: SimulationDataStore) {}

  ngOnInit(): void {
    this._store.loadGUSData('day2-gus')
   }

}
