import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";

@Component({
  selector: 'closed-status-filter',
  template: `
    <div *ngFor="let item of visibleFilterOptions" class="options">
            <input type="checkbox" [(ngModel)]="item.selected" (change)="onCheckboxChange()">
            {{item.label}}
      </div>
  `,
  styleUrls:['closed-status-filter.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ClosedStatusFilter implements IFilterAngularComp {
  params!: IFilterParams;
  public searchText: string = '';
  public visibleFilterOptions: {selected: boolean, label: string}[] = [
    {
      selected: false,
      label: 'Closed Red'
    },
    {
      selected: false,
      label: 'Closed Green'
    }
  ];


  constructor(private _store: SimulationDataStore) {}

  agInit(params: IFilterParams): void {
    this.params = params;
    // Initialize filterOptions here based on params
  }


  isFilterActive(): boolean {
      return this.visibleFilterOptions.some(option => option.selected);
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
     const data = params.data as IDataGapperUploadExtended;
      return this.visibleFilterOptions.some(option => option.selected && data["Closed Status"] === option.label);
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
