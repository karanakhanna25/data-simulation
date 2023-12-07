import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { uniq } from "lodash";

@Component({
  selector: 'sector-filter',
  template: `
    <div class="search-select">
      <input type="checkbox" [(ngModel)]="selectAll" (change)="onSelectAll()">
      <input type="text" [(ngModel)]="searchText" (input)="onSearchChange()" placeholder="Search...">
    </div>
    <div *ngFor="let item of visibleFilterOptions" class="options">
            <input type="checkbox" [(ngModel)]="item.selected" (change)="onCheckboxChange()">
            {{item.label}}
      </div>
  `,
  styleUrls:['filter.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class IndustryFilter implements IFilterAngularComp {
  params!: IFilterParams;
  public searchText: string = '';
  selectAll: boolean = true;
  public visibleFilterOptions: {selected: boolean, label: string}[] = [];

  constructor() {}

  agInit(params: IFilterParams): void {
    this.params = params;
    // Initialize filterOptions here based on params
    this.visibleFilterOptions = this.allIndustries();
  }

  onSearchChange(): void {
    this.visibleFilterOptions = this.allIndustries().filter(option =>
        option.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSelectAll(): void {
    this.visibleFilterOptions.forEach(f => f.selected = this.selectAll);
    this.onCheckboxChange(); // Apply filter changes immediately
  }

  filteredRows(): IDataGapperUploadExtended[] {
    const rowData: IDataGapperUploadExtended[] = [];
    this.params.api?.forEachNode((node) => {
      if (node.displayed) {
        rowData.push(node.data);
      }
    })
    return rowData;
  }

  allIndustries(): {selected: boolean, label: string}[] {
    return uniq(this.filteredRows().map(r => r.Industry).filter(r => !!r?.length)).map(i => ({selected: true, label: i}));
  }

  isFilterActive(): boolean {
      return true;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
     const data = params.data as IDataGapperUploadExtended;
      return this.visibleFilterOptions.some(option => {
        if (this.everyVisibleFilterDesected()) {
          return false;
        }
        return option.selected && data.Industry === option.label
      });
  }

  onCheckboxChange(): void {
    this.params.filterChangedCallback();
  }

  getModel(): any {
  }

  setModel(model: any): void {

  }

  everyVisibleFilterDesected(): boolean {
    return this.visibleFilterOptions.every(f => !f.selected);
  }
}
