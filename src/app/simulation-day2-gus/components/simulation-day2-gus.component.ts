import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";

@Component({
  selector: 'simulation-day2-gus',
  templateUrl: 'simulation-day2-gus.component.html',
  styleUrl: 'simulation-day2-gus.component.scss',
  providers: [SimulationDataStore, SimulationEngineConfigStore]
})
export class SimulationDay2GUSComponent  {

  constructor(private _store: SimulationDataStore, private _router: Router) {}

  ngOnInit(): void {
    const context = this._getContext();
    if (context) {
      console.log(context);
      this._store.loadGUSData(context);
    }
  }

   private _getContext(): string | undefined {
    const url = this._router.url;
    if (url.includes('simulation-gapdown')) {
      return 'gapdown'
    }

    if (url.includes('simulation-day-2-gus')) {
      return 'day2-gus';
    }

    if (url.includes('simulation-multiday-gapdown')) {
      return 'multiday-gapdown'
    }
    return undefined;
  }

}
