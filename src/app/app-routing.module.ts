import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-upload',
    loadChildren: () =>
      import('@app-data-upload/data-upload.module').then(
        (m) => m.DataUploadModule
      )
  },
  {
    path: 'simulation',
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
