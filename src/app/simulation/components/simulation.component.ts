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
    const context = this._getContext();
    if (context) {
      this._store.loadGUSData(context);
    }

   }

   private _getContext(): string | undefined {
    const url = this._router.url;
    if (url.includes('simulation-low-gap-gus')) {
      return 'low-gus'
    }

    if (url.includes('simulation-gus')) {
      return 'gus';
    }

    if (url.includes('simulation-combined-gus')) {
      return 'gus-combined'
    }
    return undefined;
  }

}
