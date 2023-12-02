import { formatDate } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model";

@Component({
  selector: 'chart-modal-container',
  templateUrl: 'chart-modal-container.component.html',
  styleUrls: ['chart-modal-container.component.scss']
})
export class ChartModalContainerComponent {

  ticker = this.data.Ticker;
  date = formatDate(this.data["Day 1 Date"], 'yyyy-MM-dd', 'en-US')

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDataGapperUploadExtended) {}

}
