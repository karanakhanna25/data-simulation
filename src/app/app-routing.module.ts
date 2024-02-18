import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'simulation-gus',
    loadChildren: () =>
      import('@app-simulation/simulation.module').then(
        (m) => m.SimulationdModule
      )
  },
  {
    path: 'simulation-day-2-gus',
    loadChildren: () =>
      import('@app-simulation-day2-gus/simulation-day2-gus.module').then(
        (m) => m.SimulationDay2GusModule
      )
  },
  {
    path: 'simulation-low-gap-gus',
    loadChildren: () =>
      import('@app-simulation/simulation.module').then(
        (m) => m.SimulationdModule
      )
  },
  {
    path: 'simulation-gapdown',
    loadChildren: () =>
    import('@app-simulation-day2-gus/simulation-day2-gus.module').then(
        (m) => m.SimulationDay2GusModule
      )
  },
  {
    path: 'simulation-multiday-gapdown',
    loadChildren: () =>
    import('@app-simulation-day2-gus/simulation-day2-gus.module').then(
        (m) => m.SimulationDay2GusModule
      )
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
