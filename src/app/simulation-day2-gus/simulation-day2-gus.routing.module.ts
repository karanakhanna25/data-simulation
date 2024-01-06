import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulationDay2GUSComponent } from './components/simulation-day2-gus.component';


const routes: Routes = [
  {
    path: '',
    component: SimulationDay2GUSComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationDay2GusRoutingModule { }
