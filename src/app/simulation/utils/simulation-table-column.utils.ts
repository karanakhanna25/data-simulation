import { formatDate } from '@angular/common';
import { IDataGapperUploadExtendedFields } from '@app-data-upload/data-upload.model'
import { ClosedStatusFilter } from '@app-simulation/components/custom-filter/closed-status-filter.component';
import { IndustryFilter } from '@app-simulation/components/custom-filter/inductry-filter.component';
import { SectorFilter } from '@app-simulation/components/custom-filter/sector-filter.component';
import { ClosedStatusComponent } from '@app-simulation/components/simulation-table/custom-cell-renderer/closed-status.component';
import { TopPinnedRowComponent } from '@app-simulation/components/simulation-table/custom-cell-renderer/pinned-row-title.component';
import { CellRendererSelectorResult, ColDef, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community'

function dateValueFormatter(params: ValueFormatterParams): string {
  if (params.value) {
    return formatDate(params.value, 'MM/dd/yyyy', 'en-US');
  }
  return '';

}

function pinnedRowValueFormatter(params: ValueFormatterParams): string {
  if (params.node?.rowPinned) {
    return params.value ? `${(params.value as number).toFixed(2)}%` : ''
  }
  return params.value;

}

function numberFormatter(params: ValueFormatterParams): string {
  if (params.value) {
    return (params.value as number).toFixed(2)
  }
  return ''

}

function tickerCellRenderer(params: ICellRendererParams): CellRendererSelectorResult | undefined {
  if (params.node.rowPinned) {
    return {
      component: TopPinnedRowComponent
    };
  } else {
    return undefined;
  }
}



export function agGridColumnDefs(): ColDef[] {
  return [
    {
      headerName: IDataGapperUploadExtendedFields['Closed Status'],
      field: IDataGapperUploadExtendedFields['Closed Status'],
      cellRenderer: ClosedStatusComponent ,
      cellClass: 'center-align',
      pinned: 'left',
      filter: ClosedStatusFilter,
      width: 120
    },
    {
      headerName: IDataGapperUploadExtendedFields.Ticker,
      field: IDataGapperUploadExtendedFields.Ticker,
      filter: true,
      cellRendererSelector: tickerCellRenderer,
      cellClass: 'center-align',
      pinned: 'left',
      width: 120
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 Date'],
      field: IDataGapperUploadExtendedFields['Day 1 Date'],
      filter: 'agDateColumnFilter',
      pinned: 'left',
      width: 120,
      valueFormatter: dateValueFormatter,
      filterParams: {
        // filterOptions: ['Between'],
        // provide comparator function
        comparator: (filterLocalDateAtMidnight: Date, cellValue: Date) => {
            const dateAsString = formatDate(cellValue, 'dd/MM/yyyy', 'en-US');

            if (dateAsString == null) {
                return 0;
            }

            // In the example application, dates are stored as dd/mm/yyyy
            // We create a Date object for comparison against the filter date
            const dateParts = dateAsString.split('/');
            const year = Number(dateParts[2]);
            const month = Number(dateParts[1]) - 1;
            const day = Number(dateParts[0]);
            const cellDate = new Date(year, month, day);

            // Now that both parameters are Date objects, we can compare
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        },
        cellClass: 'center-align'
    }
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 PM Vol'],
      field: IDataGapperUploadExtendedFields['Day 1 PM Vol'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 140
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 Gap %'],
      field: IDataGapperUploadExtendedFields['Day 1 Gap %'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 PM High'],
      field: IDataGapperUploadExtendedFields['Day 1 PM Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 145
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 3Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 3Min High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 5Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 5Min High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 15Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 15Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 30Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 30Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 60Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 60Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 90Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 90Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 120Min High'],
      field: IDataGapperUploadExtendedFields['Day 1 120Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 3Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 3Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 5Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 5Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 15Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 15Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 30Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 30Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 60Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 60Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 90Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 90Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 120Min Low'],
      field: IDataGapperUploadExtendedFields['Day 1 120Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 High'],
      field: IDataGapperUploadExtendedFields['Day 1 High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 Low'],
      field: IDataGapperUploadExtendedFields['Day 1 Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130

    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 Open'],
      field: IDataGapperUploadExtendedFields['Day 1 Open'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 Close'],
      field: IDataGapperUploadExtendedFields['Day 1 Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 3Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 3Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 5Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 5Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 15Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 15Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 30Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 30Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 60Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 60Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 90Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 90Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day 1 120Min Close'],
      field: IDataGapperUploadExtendedFields['Day 1 120Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: IDataGapperUploadExtendedFields['Day -1 Close'],
      field: IDataGapperUploadExtendedFields['Day -1 Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 140
    },
    {
      headerName: IDataGapperUploadExtendedFields['pmh-open%'],
      field: IDataGapperUploadExtendedFields['pmh-open%'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields['Market Cap'],
      field: IDataGapperUploadExtendedFields['Market Cap'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      pinned: 'right',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields.Float,
      field: IDataGapperUploadExtendedFields.Float,
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      pinned: 'right',
      width: 130
    },
    {
      headerName: IDataGapperUploadExtendedFields.Industry,
      field: IDataGapperUploadExtendedFields.Industry,
      filter: IndustryFilter,
      pinned: 'right',
      width: 140,
      tooltipField: IDataGapperUploadExtendedFields.Industry
    },
    {
      headerName: IDataGapperUploadExtendedFields.Sector,
      field: IDataGapperUploadExtendedFields.Sector,
      filter: SectorFilter,
      pinned: 'right',
      width: 140,
      tooltipField: IDataGapperUploadExtendedFields.Sector
    },

]

}
