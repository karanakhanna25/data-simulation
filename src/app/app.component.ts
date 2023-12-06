import { Component, OnInit } from '@angular/core';
import { SimulationDataStore } from '@app-simulation/store/data-upload.store';
import { SimulationEngineConfigStore } from '@app-simulation/store/simulation-config.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent  {

  navLinks = [
    { path: '/simulation-gus', label: 'Simulation - GUS' },
  ];

  constructor() {}


}
