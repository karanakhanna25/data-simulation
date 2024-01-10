import { formatDate } from '@angular/common';
import { ISimulationDay2GUSDataExtendedFields } from '@app-simulation-day2-gus/simulation-day2-gus.model';
import { ClosedStatusFilter } from '@app-simulation/components/custom-filter/closed-status-filter.component';
import { IndustryFilter } from '@app-simulation/components/custom-filter/industry-filter.component';
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
    return Number((params.value as number).toFixed(2)).toLocaleString()
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



export function day2GUSAgGridColumnDefs(): ColDef[] {
  return [
    {
      headerName: 'Status',
      field: ISimulationDay2GUSDataExtendedFields['Closed Status'],
      cellRenderer: ClosedStatusComponent ,
      cellClass: 'center-align',
      filter: ClosedStatusFilter,
      width: 120
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields.Ticker,
      field: ISimulationDay2GUSDataExtendedFields.Ticker,
      filter: true,
      cellRendererSelector: tickerCellRenderer,
      cellClass: 'center-align',
      width: 120,
      pinned: 'left'
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Date'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Date'],
      filter: 'agDateColumnFilter',

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
        cellClass: 'center-align',
        pinned: 'left'
    }
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 PM Vol'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 PM Vol'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 140,
      valueFormatter: numberFormatter
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Gap %'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Gap %'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Vol'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Vol'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 PM High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 PM High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 145
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 PM Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 PM Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 145
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 3Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 3Min High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 5Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 5Min High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 15Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 15Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 30Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 30Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 60Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 60Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 90Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 90Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 120Min High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 120Min High'],
      filter: 'agNumberColumnFilter',
      valueFormatter: pinnedRowValueFormatter,
      cellClass: 'center-align',
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 3Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 3Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 5Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 5Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 15Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 15Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 30Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 30Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 60Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 60Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 90Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 90Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 120Min Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 120Min Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 High'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 High'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Low'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Low'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130

    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Open'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Open'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 3Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 3Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 5Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 5Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 160
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 15Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 15Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 30Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 30Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 60Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 60Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 90Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 90Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day 1 120Min Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day 1 120Min Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: pinnedRowValueFormatter,
      width: 170
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Day -1 Close'],
      field: ISimulationDay2GUSDataExtendedFields['Day -1 Close'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 140
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Market Cap'],
      field: ISimulationDay2GUSDataExtendedFields['Market Cap'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields.Float,
      field: ISimulationDay2GUSDataExtendedFields.Float,
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Inst Own'],
      field: ISimulationDay2GUSDataExtendedFields['Inst Own'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields.Industry,
      field: ISimulationDay2GUSDataExtendedFields.Industry,
      filter: IndustryFilter,

      width: 140,
      tooltipField: ISimulationDay2GUSDataExtendedFields.Industry
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields.Sector,
      field: ISimulationDay2GUSDataExtendedFields.Sector,
      filter: SectorFilter,
      width: 140,
      tooltipField: ISimulationDay2GUSDataExtendedFields.Sector
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['pmh-open%'],
      field: ISimulationDay2GUSDataExtendedFields['pmh-open%'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 130
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Open-High Spike%'],
      field: ISimulationDay2GUSDataExtendedFields['Open-High Spike%'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      valueFormatter: numberFormatter,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Open wrt to Fib'],
      field: ISimulationDay2GUSDataExtendedFields['Open wrt to Fib'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['30Min Close < Open'],
      field: ISimulationDay2GUSDataExtendedFields['30Min Close < Open'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['60Min Close < Open'],
      field: ISimulationDay2GUSDataExtendedFields['60Min Close < Open'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['60Min High > 30Min High'],
      field: ISimulationDay2GUSDataExtendedFields['60Min High > 30Min High'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Broke 11am High'],
      field: ISimulationDay2GUSDataExtendedFields['Broke 11am High'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Broke 9:45am High'],
      field: ISimulationDay2GUSDataExtendedFields['Broke 9:45am High'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Broke 10:30am High'],
      field: ISimulationDay2GUSDataExtendedFields['Broke 10:30am High'],
      cellClass: 'center-align',
      filter: true,
      width: 180
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields['Profit/Loss'],
      field: ISimulationDay2GUSDataExtendedFields['Profit/Loss'],
      filter: 'agNumberColumnFilter',
      cellClass: 'center-align',
      width: 140,
      valueFormatter: numberFormatter
    },
    {
      headerName: ISimulationDay2GUSDataExtendedFields.Equity,
      field: ISimulationDay2GUSDataExtendedFields.Equity,
      filter: false,
      cellClass: 'center-align',
      width: 140,
      valueFormatter: numberFormatter
    },

]

}
