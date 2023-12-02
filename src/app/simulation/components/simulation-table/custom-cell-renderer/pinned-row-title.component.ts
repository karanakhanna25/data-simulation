import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  template:`<label>{{titleName()}}</label>`,
  styleUrls: ['pinned-row-title.component.scss']
})
export class TopPinnedRowComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return  false
  }

  titleName(): string {
    return this.params.node.rowIndex === 0 ? 'Average(open)': 'Median';
  }

}
