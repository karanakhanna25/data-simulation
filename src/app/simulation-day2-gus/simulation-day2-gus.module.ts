import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FirebaseService } from "@app-simulation/services/firebase.service";
import { PolygonService } from "@app-simulation/services/polygon.service";
import { SimulationDay2GusRoutingModule } from "./simulation-day2-gus.routing.module";


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    SimulationDay2GusRoutingModule
  ],
  exports: [],
  providers: [FirebaseService, PolygonService],
})
export class SimulationdModule { }
