import { NgModule } from '@angular/core';
import { FirebaseService } from '@app-data-upload/services/firebase.service';
import { SimulationRoutingModule } from './simulation-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { SimulationTableComponent } from './components/simulation-table/simulation-table.component';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './components/simulation.component';
import {MatDialogModule} from '@angular/material/dialog';
import { PolygonService } from '@app-data-upload/services/polygon.service';
import { ChartModalContainerComponent } from './components/chart-modal-container.component';
import { TVLightweightChartComponent } from './components/tv-chart-renderer/tv-chart-renderer.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    SimulationComponent,
    SimulationTableComponent,
    ChartModalContainerComponent,
    TVLightweightChartComponent
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    AgGridModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [],
  providers: [FirebaseService, PolygonService],
})
export class SimulationdModule { }
