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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
