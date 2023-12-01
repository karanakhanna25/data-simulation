import { Component, HostBinding, computed } from '@angular/core';
import { IDataGapperUploadExtended, IDataGapperUploadExtendedFields } from '@app-data-upload/data-upload.model';
import { DataUploadStore } from '@app-data-upload/stores/data-upload.store/data-upload.store';
import { avgPercentForTimeFrame, medianPercentForTimeFrame } from '@app-simulation/utils/calculations.utils';
import { agGridColumnDefs } from '@app-simulation/utils/simulation-table-column.utils';
import { FilterChangedEvent, GridApi, GridOptions, GridReadyEvent, RowClassParams } from 'ag-grid-community';

@Component({
  selector: 'quant-sim-simulation-table',
  templateUrl: 'simulation-table.component.html',
  styleUrl: 'simulation-table.component.scss',
})
export class SimulationTableComponent {

  @HostBinding('class')
  className = 'quant-sim-simulation-table'

  gripApi!: GridApi;
  columnApi!: any;

  readonly rowData = this._store.gusData;

  colDefs = agGridColumnDefs();

  gridoptions: GridOptions = {
    context: {parentComponent: this},
    animateRows: true,
    getRowClass: this.getRowClass.bind(this),
    onFilterChanged: this.onFilterChanged.bind(this),
  }

  constructor(private _store: DataUploadStore) {}

  onGridReady(params: GridReadyEvent): void {
    this.gripApi = params.api;
    params.api.setGridOption('pinnedTopRowData', [...this._generatePinnedAverageRowData(), ...this._generatePinnedMedianRowData()]);
  }

  getRowClass(data: RowClassParams): string {
    const records: IDataGapperUploadExtended = data.data;
    if (records['Day 1 Open'] < records['Day 1 Close']) {
      return 'row-green'
    }

    if (records['Day 1 Open'] > records['Day 1 Close']) {
      return 'row-red'
    }

    return ''
  }

  onFilterChanged(evt: FilterChangedEvent): void {
    this.gripApi = evt.api;
    evt.api.setGridOption('pinnedTopRowData', [...this._generatePinnedAverageRowData(), ...this._generatePinnedMedianRowData()]);
  }

  filteredRows(): IDataGapperUploadExtended[] {
    const rowData: IDataGapperUploadExtended[] = [];
    this.gripApi?.forEachNode((node) => {
      if (node.displayed) {
        rowData.push(node.data);
      }
    })
    return rowData;
  }

  private _generatePinnedAverageRowData(): IDataGapperUploadExtended[] {
    return this._generatePinnedDummyRow().map(d => ({
      "Day 1 Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 Low'], this.filteredRows()),
      "Day 1 Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 Close'], this.filteredRows()),
      "Day 1 3Min High":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min High'], this.filteredRows()),
      "Day 1 5Min High":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min High'], this.filteredRows()),
      "Day 1 15Min High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min High'], this.filteredRows()),
      "Day 1 30Min High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min High'], this.filteredRows()),
      "Day 1 60Min High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min High'], this.filteredRows()),
      "Day 1 90Min High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min High'], this.filteredRows()),
      "Day 1 120Min High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min High'], this.filteredRows()),
      "Day 1 High": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 High'], this.filteredRows()),
      "Day 1 3Min Low":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min Low'], this.filteredRows()),
      "Day 1 5Min Low":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min Low'], this.filteredRows()),
      "Day 1 15Min Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min Low'], this.filteredRows()),
      "Day 1 30Min Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min Low'], this.filteredRows()),
      "Day 1 60Min Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min Low'], this.filteredRows()),
      "Day 1 90Min Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min Low'], this.filteredRows()),
      "Day 1 120Min Low": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min Low'], this.filteredRows()),
      "Day 1 3Min Close":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min Close'], this.filteredRows()),
      "Day 1 5Min Close":  avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min Close'], this.filteredRows()),
      "Day 1 15Min Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min Close'], this.filteredRows()),
      "Day 1 30Min Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min Close'], this.filteredRows()),
      "Day 1 60Min Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min Close'], this.filteredRows()),
      "Day 1 90Min Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min Close'], this.filteredRows()),
      "Day 1 120Min Close": avgPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min Close'], this.filteredRows()),
    })) as IDataGapperUploadExtended[];
  }

  private _generatePinnedMedianRowData(): IDataGapperUploadExtended[] {
    return this._generatePinnedDummyRow().map(d => ({
      "Day 1 Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 Low'], this.filteredRows()),
      "Day 1 Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 Close'], this.filteredRows()),
      "Day 1 3Min High":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min High'], this.filteredRows()),
      "Day 1 5Min High":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min High'], this.filteredRows()),
      "Day 1 15Min High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min High'], this.filteredRows()),
      "Day 1 30Min High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min High'], this.filteredRows()),
      "Day 1 60Min High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min High'], this.filteredRows()),
      "Day 1 90Min High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min High'], this.filteredRows()),
      "Day 1 120Min High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min High'], this.filteredRows()),
      "Day 1 High": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 High'], this.filteredRows()),
      "Day 1 3Min Low":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min Low'], this.filteredRows()),
      "Day 1 5Min Low":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min Low'], this.filteredRows()),
      "Day 1 15Min Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min Low'], this.filteredRows()),
      "Day 1 30Min Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min Low'], this.filteredRows()),
      "Day 1 60Min Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min Low'], this.filteredRows()),
      "Day 1 90Min Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min Low'], this.filteredRows()),
      "Day 1 120Min Low": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min Low'], this.filteredRows()),
      "Day 1 3Min Close":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 3Min Close'], this.filteredRows()),
      "Day 1 5Min Close":  medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 5Min Close'], this.filteredRows()),
      "Day 1 15Min Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 15Min Close'], this.filteredRows()),
      "Day 1 30Min Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 30Min Close'], this.filteredRows()),
      "Day 1 60Min Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 60Min Close'], this.filteredRows()),
      "Day 1 90Min Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 90Min Close'], this.filteredRows()),
      "Day 1 120Min Close": medianPercentForTimeFrame(IDataGapperUploadExtendedFields['Day 1 120Min Close'], this.filteredRows()),
    })) as IDataGapperUploadExtended[];
  }

  closedRed(): IDataGapperUploadExtended[] {
    return (this.filteredRows() || []).filter(r => r['Day 1 Open'] > r['Day 1 Close']);
  }

  closedRedPercent(): number {
    return Number(((this.closedRed().length)/((this.filteredRows() || []).length) * 100).toFixed(2));
  }


  timeFrameHighBrokeCount(timeFrame: string): number {
    return (this.filteredRows().filter(r => {
      const timeFrameHigh = (r[timeFrame as keyof typeof r] as number);
      return r['Day 1 High'] > timeFrameHigh;
    }) || []).length;
  }

  timeFrameHighBrokeAndClosedRed(timeFrame: string): number {
    return (this.filteredRows().filter(r => {
      const timeFrameHigh = (r[timeFrame as keyof typeof r] as number);
      return r['Day 1 High'] > timeFrameHigh;
    }).filter(f => f['Day 1 Open'] > f['Day 1 Close']) || []).length;
  }

  first15MinHighBreakCount(): number {
    return this.timeFrameHighBrokeCount(IDataGapperUploadExtendedFields['Day 1 15Min High']);
  }

  first15MinHighBreakClosedRed(): number {
    return this.timeFrameHighBrokeAndClosedRed(IDataGapperUploadExtendedFields['Day 1 15Min High']);
  }

  private _generatePinnedDummyRow(): IDataGapperUploadExtended[] {
    return [
      agGridColumnDefs().map(col => ({[`${col.field}`]: undefined } as any))
      .reduce((result,current) => Object.assign(result,current), {})
    ]
  }


}
