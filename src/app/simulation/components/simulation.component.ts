import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationDataStore } from '@app-simulation/store/data-upload.store';
import { SimulationEngineConfigStore } from '@app-simulation/store/simulation-config.store';

@Component({
  selector: 'quant-sim-simulation',
  templateUrl: 'simulation.component.html',
  styleUrl: 'simulation.component.scss',
  providers: [SimulationDataStore, SimulationEngineConfigStore]
})
export class SimulationComponent {


  constructor(private _store: SimulationDataStore, private _router: Router) {}

  ngOnInit(): void {
    const context = this._router.url.includes('simulation-low-gap-gus') ? 'low-gus' : 'gus';
    this._store.loadGUSData(context)
   }

}
