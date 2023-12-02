import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import {MatIconModule} from '@angular/material/icon';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ChartModalContainerComponent } from "@app-simulation/components/chart-modal-container.component";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  template:`<mat-icon *ngIf="!isPinnedRow()" (click)="openDialog()"> show_chart</mat-icon>`,
  styleUrls: ['closed-status.component.scss'],
  imports: [MatIconModule, MatDialogModule, CommonModule]
})
export class ClosedStatusComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor(private _dialog: MatDialog) {}

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return  false
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(ChartModalContainerComponent, {
      data: this.params.data
    });
  }

  isPinnedRow(): boolean {
    return this.params.node.isRowPinned();
  }

}
