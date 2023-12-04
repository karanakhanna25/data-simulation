import { Component, OnInit } from '@angular/core';
import { SimulationDataStore } from '@app-data-upload/stores/data-upload.store/data-upload.store';
import { SimulationEngineConfigStore } from '@app-simulation/store/simulation-config.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [SimulationDataStore, SimulationEngineConfigStore]
})
export class AppComponent implements OnInit {

  navLinks = [
    { path: 'data-upload', label: 'Data Upload' },
    { path: '/simulation', label: 'Simulation' },
  ];

  constructor(private _store: SimulationDataStore) {}

  ngOnInit(): void {
    this._store.loadData()
  }

}
