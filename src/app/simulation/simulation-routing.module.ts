import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulationComponent } from './components/simulation.component';
import { SimulationEngineComponent } from './components/simulation-engine/simulation-engine.component';
import { AnalyticsComponent } from './components/analytics-chart/analytics-component';


const routes: Routes = [
  {
    path: '',
    component: SimulationComponent,
    children: [
      {
        path: 'simulation-engine',
        component: SimulationEngineComponent
      },
      {
        path: 'analytics',
        component: AnalyticsComponent
      },
      {
        path: '',
        redirectTo: 'simulation-engine',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
