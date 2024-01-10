import { Component } from "@angular/core";
import { ColDef, FilterChangedEvent, GridApi, GridOptions, GridReadyEvent, RowClassParams, SortChangedEvent } from "ag-grid-community";
import { day2GUSAgGridColumnDefs } from "./simulation-day-2-table.columns.utils";
import { formatDate } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ExcelFileNameInputDialogComponent } from "@app-simulation/components/simulation-table/excel-file-input/excel-file-input-dialog.component";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { avgPercentForTimeFrame, medianPercentForTimeFrame } from "@app-simulation/utils/calculations.utils";
import { agGridColumnDefs } from "@app-simulation/utils/simulation-table-column.utils";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { filter, take } from "rxjs";
import { ISimualationDay2GUSExtended, ISimulationDay2GUSDataExtendedFields } from "@app-simulation-day2-gus/simulation-day2-gus.model";
import * as XLSX from 'xlsx';

@UntilDestroy()
@Component({
  selector: 'simulation-day2-gus-table',
  templateUrl: 'simulation-day2-gus-table.component.html',
  styleUrls: ['simulation-day2-gus-table.component.scss']
})
export class SimulationDay2GusTableComponent {

  gripApi!: GridApi;
  columnApi!: any;

  readonly rowData = this._store.gusData;
  readonly rowData$ = this._store.select(state => state.allRecords);
  readonly filterText = this._configStore.filterText;
  readonly closedRed = this._store.closedRedCount;
  readonly closedRedPercent = this._store.closedRedPercent;
  readonly visibleRows = this._store.visibleRows;

  colDefs = day2GUSAgGridColumnDefs();

  gridoptions: GridOptions = {
    context: {parentComponent: this},
    animateRows: true,
    getRowClass: this.getRowClass.bind(this),
    onFilterChanged: this.onFilterChanged.bind(this),
    onSortChanged: this.onSortChanged.bind(this)
  }

  constructor(private _store: SimulationDataStore, private _configStore: SimulationEngineConfigStore, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this._configStore.simulationEngineConfig$.pipe(
      filter(() => this.filteredRows().length > 0),
      untilDestroyed(this)
    ).subscribe(() => this._store.runPnlCalculations(this.filteredRows()));

    this._configStore.filter$.pipe(
      filter(() => !!this.gripApi),
      untilDestroyed(this)
    ).subscribe(filter => this.gripApi.setFilterModel(filter));
  }

  onFileChanged(evt: Event): void {
    const target: DataTransfer = evt.target as unknown as DataTransfer;
    if (target.files.length !== 1) throw new Error('Upload One file at a time');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', cellDates: true});
      const sheetName = (workbook.SheetNames || [])[0] || undefined;
      if (sheetName) {
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const headers = jsonData[0] as string[];
        const data = this._mapToFields(jsonData.slice(1).reduce((acc: any, row: any) => {
          const rowObj = (row || []).reduce((obj: any, cell: any, index: number) => {
            obj[headers[index]] = this._convertToNumber(cell);
            return obj;
          }, {});
          acc.push(rowObj);
          return acc;
        }, []) as ISimualationDay2GUSExtended[]).map(d => ({...d,
            ["Day 1 Date"]: new Date(formatDate(d['Day 1 Date'], 'MM-dd-yyyy', 'en-US')) ,id: `${d['Day 1 Date']}-${d.Ticker}`})) as ISimualationDay2GUSExtended[];
        this._store.uploadGusData({
          data: data.filter(d => d.id !== 'undefined-undefined').filter(d => !d['Market Cap']?.length ),
          // data: [],
          context: 'day2-gus',
          type: 'append'
        });
      }
    }
    reader.readAsBinaryString(target.files[0]);
  }

  exportFromGrid(): void {
    const ref = this._dialog.open(ExcelFileNameInputDialogComponent, {
      width: '400px',
    });
    ref.afterClosed().pipe(
      take(1)
    ).subscribe(data => {
      this._exportFromGrid(data);
    })
  }

  private _exportFromGrid(fileName: string): void {
    const data = this.orderedFilteredRows(); // Get AG-Grid data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Convert to worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new(); // New workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append sheet to workbook

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }


  private _mapToFields(data: ISimualationDay2GUSExtended[]): ISimualationDay2GUSExtended[] {
    const fields = Object.keys(ISimulationDay2GUSDataExtendedFields);
    return data.map(d => {
      const dataKeys = Object.keys(d);
      return dataKeys.reduce((obj: any, key: string) => {
        if (fields.includes(key)) {
          obj[key] = d[key as keyof typeof d];
        }
        return obj;
      }, {})
    })
  }

  private _convertToNumber(value: any): any {
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gripApi = params.api;
    params.api.setGridOption('pinnedTopRowData', [...this._generatePinnedAverageRowData(), ...this._generatePinnedMedianRowData()]);
    this.rowData$.pipe(
      filter(data => !!data.length),
      take(1)
    ).subscribe(data => {
      this._store.runPnlCalculations(data as ISimualationDay2GUSExtended[]);
    })
  }

  getRowClass(data: RowClassParams): string {
    const records: ISimualationDay2GUSExtended = data.data;
    if (records['Day 1 Open'] < records['Day 1 Close']) {
      return 'row-green'
    }

    if (records['Day 1 Open'] > records['Day 1 Close']) {
      return 'row-red'
    }

    return ''
  }

  remove(key: string): void {
    const activeFilter = this.gripApi.getFilterModel();
    delete activeFilter[key];
    this._configStore.updateFilter(activeFilter);
  }

  onFilterChanged(evt: FilterChangedEvent): void {
    this.gripApi = evt.api;
    evt.api.setGridOption('pinnedTopRowData', [...this._generatePinnedAverageRowData(), ...this._generatePinnedMedianRowData()]);
    this._configStore.updateFilter(this.gripApi.getFilterModel());
    this._store.runPnlCalculations(this.filteredRows());
  }

  onSortChanged(evt: SortChangedEvent): void {
    this.gripApi = evt.api;
    this._store.runPnlCalculations(this.filteredRows());
  }

  filteredRows(): ISimualationDay2GUSExtended[] {
    const rowData: ISimualationDay2GUSExtended[] = [];
    this.gripApi?.forEachNode((node) => {
      if (node.displayed) {
        rowData.push(node.data);
      }
    })
    return rowData;
  }

  orderedFilteredRows(): ISimualationDay2GUSExtended[] {
    const rowData: ISimualationDay2GUSExtended[] = [];
    const filterCols = [ISimulationDay2GUSDataExtendedFields['Closed Status'], ISimulationDay2GUSDataExtendedFields['pmh-open%']];
    const columnDefs = (agGridColumnDefs() as ColDef[]).filter(d => !(filterCols as any).includes(d.field));
    this.gripApi?.forEachNode((node) => {
      const orderedData = {};
      columnDefs.forEach((colDef: ColDef) => {
        const field = colDef.field as string;
        (orderedData as any)[field] = node.data[field];
      });
      if (node.displayed) {
        rowData.push(orderedData as ISimualationDay2GUSExtended);
      }
    })
    return rowData;
  }

  private _generatePinnedAverageRowData(): ISimualationDay2GUSExtended[] {
    return this._generatePinnedDummyRow().map(d => ({
      "Day 1 Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 Low'], this.filteredRows()),
      "Day 1 Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 Close'], this.filteredRows()),
      "Day 1 3Min High":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min High'], this.filteredRows()),
      "Day 1 5Min High":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min High'], this.filteredRows()),
      "Day 1 15Min High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min High'], this.filteredRows()),
      "Day 1 30Min High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min High'], this.filteredRows()),
      "Day 1 60Min High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min High'], this.filteredRows()),
      "Day 1 90Min High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min High'], this.filteredRows()),
      "Day 1 120Min High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min High'], this.filteredRows()),
      "Day 1 High": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 High'], this.filteredRows()),
      "Day 1 3Min Low":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min Low'], this.filteredRows()),
      "Day 1 5Min Low":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min Low'], this.filteredRows()),
      "Day 1 15Min Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min Low'], this.filteredRows()),
      "Day 1 30Min Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min Low'], this.filteredRows()),
      "Day 1 60Min Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min Low'], this.filteredRows()),
      "Day 1 90Min Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min Low'], this.filteredRows()),
      "Day 1 120Min Low": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min Low'], this.filteredRows()),
      "Day 1 3Min Close":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min Close'], this.filteredRows()),
      "Day 1 5Min Close":  avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min Close'], this.filteredRows()),
      "Day 1 15Min Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min Close'], this.filteredRows()),
      "Day 1 30Min Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min Close'], this.filteredRows()),
      "Day 1 60Min Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min Close'], this.filteredRows()),
      "Day 1 90Min Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min Close'], this.filteredRows()),
      "Day 1 120Min Close": avgPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min Close'], this.filteredRows()),
    })) as ISimualationDay2GUSExtended[];
  }

  private _generatePinnedMedianRowData(): ISimualationDay2GUSExtended[] {
    return this._generatePinnedDummyRow().map(d => ({
      "Day 1 Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 Low'], this.filteredRows()),
      "Day 1 Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 Close'], this.filteredRows()),
      "Day 1 3Min High":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min High'], this.filteredRows()),
      "Day 1 5Min High":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min High'], this.filteredRows()),
      "Day 1 15Min High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min High'], this.filteredRows()),
      "Day 1 30Min High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min High'], this.filteredRows()),
      "Day 1 60Min High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min High'], this.filteredRows()),
      "Day 1 90Min High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min High'], this.filteredRows()),
      "Day 1 120Min High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min High'], this.filteredRows()),
      "Day 1 High": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 High'], this.filteredRows()),
      "Day 1 3Min Low":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min Low'], this.filteredRows()),
      "Day 1 5Min Low":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min Low'], this.filteredRows()),
      "Day 1 15Min Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min Low'], this.filteredRows()),
      "Day 1 30Min Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min Low'], this.filteredRows()),
      "Day 1 60Min Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min Low'], this.filteredRows()),
      "Day 1 90Min Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min Low'], this.filteredRows()),
      "Day 1 120Min Low": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min Low'], this.filteredRows()),
      "Day 1 3Min Close":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 3Min Close'], this.filteredRows()),
      "Day 1 5Min Close":  medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 5Min Close'], this.filteredRows()),
      "Day 1 15Min Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 15Min Close'], this.filteredRows()),
      "Day 1 30Min Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 30Min Close'], this.filteredRows()),
      "Day 1 60Min Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 60Min Close'], this.filteredRows()),
      "Day 1 90Min Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 90Min Close'], this.filteredRows()),
      "Day 1 120Min Close": medianPercentForTimeFrame(ISimulationDay2GUSDataExtendedFields['Day 1 120Min Close'], this.filteredRows()),
    })) as ISimualationDay2GUSExtended[];
  }

  // closedRed(): ISimualationDay2GUSExtended[] {
  //   return (this.filteredRows() || []).filter(r => r['Day 1 Open'] > r['Day 1 Close']);
  // }

  // closedRedPercent(): number {
  //   return Number(((this.closedRed().length)/((this.filteredRows() || []).length) * 100).toFixed(2));
  // }


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
    return this.timeFrameHighBrokeCount(ISimulationDay2GUSDataExtendedFields['Day 1 15Min High']);
  }

  first15MinHighBreakClosedRed(): number {
    return this.timeFrameHighBrokeAndClosedRed(ISimulationDay2GUSDataExtendedFields['Day 1 15Min High']);
  }

  private _generatePinnedDummyRow(): ISimualationDay2GUSExtended[] {
    return [
      agGridColumnDefs().map(col => ({[`${col.field}`]: undefined } as any))
      .reduce((result,current) => Object.assign(result,current), {})
    ]
  }
}
