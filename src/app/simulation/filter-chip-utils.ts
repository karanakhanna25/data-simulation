import { ColDef } from "ag-grid-community";
import { agGridColumnDefs } from "./utils/simulation-table-column.utils";
import { formatDate } from "@angular/common";

const filterTypeToSymbolMap: {[key: string]: string} = {
  equals: '=',
  lessThan: '<',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  lessThanOrEqual: '<=',
  notEqual: '!=',
  blank: 'Blank',
  notBlank: 'Not Blank',
  contains: 'Contains',
  startsWith: 'Starts With'
}

function updateFilterCondition(columnfilterModel: any): string {
  const fromValue = columnfilterModel.filter || columnfilterModel.dateFrom;
  const toValue = columnfilterModel.filterTo || columnfilterModel.dateTp;
  return `${fromValue} - ${toValue}`;
}

function slicingSquareBraces(expression: string): string {
  if (expression.startsWith('[') && expression.endsWith(']')) {
    return expression.slice(1,-1);
  }
  return expression;
}

function buildFilterExpression(columnFilterModel: any): string {
  switch(columnFilterModel.type) {
    case 'inRange':
      return `[ ${updateFilterCondition(columnFilterModel)} ]`;
    default:
      if (!columnFilterModel.operator) {
        if (columnFilterModel.filter === 0 || columnFilterModel.filter) {
          return `[ ${filterTypeToSymbolMap[columnFilterModel.type]} ${columnFilterModel.filter} ]`;
        }
        if(columnFilterModel.filterType === 'date') {
          return `[${filterTypeToSymbolMap[columnFilterModel.type]} ${checkAndFormatDate(columnFilterModel.dateFrom) || checkAndFormatDate(columnFilterModel.dateTo)}]`
        }
        return `[${filterTypeToSymbolMap[columnFilterModel.type]}]`;
      } else {
        return `[${slicingSquareBraces(buildFilterExpression(columnFilterModel.condition1))} ${columnFilterModel.operator}
          ${slicingSquareBraces(buildFilterExpression(columnFilterModel.condition2))}]`
      }
  }
}

function checkAndFormatDate(date: string): string {
  return date ? formatDate(date, 'MM-dd-yyyy', 'en-US') : date;
}

export function getFilterExpression(filters: any): {key: string, expression: string}[] {
  return Object.keys(filters).reduce((arr: {key:string, expression: string}[], val) => {
    const colFilterModel = filters[val];
    const expression = `${getColForField(val)?.headerName || ''} ${buildFilterExpression(colFilterModel)}`;
    const value = {key: val, expression};
    return [...arr, ...[value]];
  }, []);
}

function getColForField(val: string): ColDef | undefined{
  return agGridColumnDefs().find(col => col.field === val);
}
