import { formatDate } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";
import { extractFibLevel, getRiskTimeFrameHighValue } from "@app-simulation/utils/common.utils";

@Component({
  selector: 'chart-modal-container',
  templateUrl: 'chart-modal-container.component.html',
  styleUrls: ['chart-modal-container.component.scss']
})
export class ChartModalContainerComponent {

  ticker = this.data.Ticker;
  date = formatDate(this.data["Day 1 Date"], 'yyyy-MM-dd', 'en-US')

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDataGapperUploadExtended) {}

  openTOHODSpikePercent(): number {
    return this.data["Open-High Spike%"];
  }

  High1130ToClose1130AMFadePercent(): number {
    return Number((((this.data["Day 1 120Min Close"] - this.data["Day 1 120Min High"])/this.data["Day 1 120Min High"] * 100).toFixed(2)));
  }

  FibLevelToClose1130AMFadePercent(level: number): number | string {
    const fibLevel = extractFibLevel(level, this.data);
    const timeFrameHigh = getRiskTimeFrameHighValue(120, this.data)
    return timeFrameHigh >= fibLevel ?  Number((((this.data["Day 1 120Min Close"] - fibLevel)/fibLevel * 100).toFixed(2))) : 'N/A';
  }

  OpenToClose1130AMFadePercent(): number {
    return Number((((this.data["Day 1 120Min Close"] - this.data["Day 1 Open"])/this.data["Day 1 Open"] * 100).toFixed(2)));
  }

  OpenToCloseFadePercent(): number {
    return Number((((this.data["Day 1 Close"] - this.data["Day 1 Open"])/this.data["Day 1 Open"] * 100).toFixed(2)));
  }
}
