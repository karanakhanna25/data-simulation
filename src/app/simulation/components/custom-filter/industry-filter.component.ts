import { CommonModule } from "@angular/common";
import { Component, Signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { uniq } from "lodash";

@Component({
  selector: 'sector-filter',
  template: `
    <input type="text" [(ngModel)]="searchText" (input)="onSearchChange()" placeholder="Search...">
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
  public visibleFilterOptions: {selected: boolean, label: string}[] = [];
  industries = this._store.allIndustries;

  filterOptions: Signal<{selected: boolean, label: string}[]> = computed(() => this.industries().map(i => ({selected: true, label: i})))

  constructor(private _store: SimulationDataStore) {}

  agInit(params: IFilterParams): void {
    this.params = params;
    // Initialize filterOptions here based on params
    this.visibleFilterOptions = this.filterOptions();
}

onSearchChange(): void {
  this.visibleFilterOptions = this.filterOptions().filter(option =>
      option.label.toLowerCase().includes(this.searchText.toLowerCase())
  );
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

isFilterActive(): boolean {
    return this.visibleFilterOptions.some(option => option.selected);
}

doesFilterPass(params: IDoesFilterPassParams): boolean {
   const data = params.data as IDataGapperUploadExtended;
    return this.visibleFilterOptions.some(option => {
      return option.selected && data.Industry === option.label
    });
}

onCheckboxChange(): void {
    this.params.filterChangedCallback();
}

getModel(): any {
    // Return a model representing the current filter state
}

setModel(model: any): void {
    // Set the filter state based on the model
}
}
