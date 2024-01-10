import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FirebaseService } from "@app-simulation/services/firebase.service";
import { PolygonService } from "@app-simulation/services/polygon.service";
import { SimulationDay2GusRoutingModule } from "./simulation-day2-gus.routing.module";
import { DrawerContainerComponent } from "@app-common/drawer-container/drawer-container.component";
import { SimulationDay2GusTableComponent } from "./components/simulation-day-2-gus-table/simulation-day2-gus-table.component";
import { SimulationDay2GUSComponent } from "./components/simulation-day2-gus.component";
import { AgGridModule } from "ag-grid-angular";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { SimulationEngineComponent } from "@app-simulation/components/simulation-engine/simulation-engine.component";
import { ChartModule } from "../charts/chart.module";


@NgModule({
  declarations: [
    SimulationDay2GusTableComponent,
    SimulationDay2GUSComponent,
   ],
  imports: [
    CommonModule,
    SimulationDay2GusRoutingModule,
    DrawerContainerComponent,
    AgGridModule,
    MatChipsModule,
    MatIconModule,
    SimulationEngineComponent,
    ChartModule
  ],
  exports: [],
  providers: [FirebaseService, PolygonService],
})
export class SimulationDay2GusModule { }
