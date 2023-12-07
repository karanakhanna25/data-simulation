import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

export interface IDataUploadSate {
  allRecords: IDataGapperUploadExtended[];
  visibleRows: IDataGapperUploadExtended[];
};

export const dataUploadInitialState: IDataUploadSate = {
  allRecords: [],
  visibleRows: []
}
