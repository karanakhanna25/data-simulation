import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
  selector: 'drawer-container',
  templateUrl: 'drawer-container.component.html',
  styleUrl: 'drawer-container.component.scss',
  imports: [MatSidenavModule, MatIconModule, CommonModule],
  standalone: true
})
export class DrawerContainerComponent  {}
