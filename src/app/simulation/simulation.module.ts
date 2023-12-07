import { NgModule } from '@angular/core';
import { FirebaseService } from '@app-simulation/services/firebase.service';
import { SimulationRoutingModule } from './simulation-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { SimulationTableComponent } from './components/simulation-table/simulation-table.component';
import { CommonModule } from '@angular/common';
import { SimulationComponent } from './components/simulation.component';
import {MatDialogModule} from '@angular/material/dialog';
import { PolygonService } from '@app-simulation/services/polygon.service';
import { ChartModalContainerComponent } from './components/chart-modal-container.component';
import { TVLightweightChartComponent } from './components/tv-chart-renderer/tv-chart-renderer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon';
import { SimulationEngineComponent } from './components/simulation-engine/simulation-engine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from '../charts/chart.module';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  declarations: [
    SimulationComponent,
    SimulationTableComponent,
    ChartModalContainerComponent,
    TVLightweightChartComponent,
    SimulationEngineComponent
  ],
  imports: [
    CommonModule,
    SimulationRoutingModule,
    AgGridModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    MatChipsModule,
    MatDialogModule
  ],
  exports: [],
  providers: [FirebaseService, PolygonService],
})
export class SimulationdModule { }
