import { NgModule } from '@angular/core';
import { FirebaseService } from '@app-data-upload/services/firebase.service';
import { SimulationRoutingModule } from './simulation-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { SimulationTableComponent } from './components/simulation-table/simulation-table.component';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './components/simulation.component';


@NgModule({
  declarations: [
    SimulationComponent,
    SimulationTableComponent
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    AgGridModule
  ],
  exports: [],
  providers: [FirebaseService],
})
export class SimulationdModule { }
