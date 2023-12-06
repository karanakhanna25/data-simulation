import { Component } from '@angular/core';
import { SimulationDataStore } from '@app-simulation/store/data-upload.store';
import { SimulationEngineConfigStore } from '@app-simulation/store/simulation-config.store';

@Component({
  selector: 'quant-sim-simulation',
  templateUrl: 'simulation.component.html',
  styleUrl: 'simulation.component.scss',
  providers: [SimulationDataStore, SimulationEngineConfigStore]
})
export class SimulationComponent {


  constructor(private _store: SimulationDataStore) {}

  ngOnInit(): void {
    this._store.loadGUSData('gus')
   }

}
