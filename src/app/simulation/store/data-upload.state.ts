import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

export interface IDataUploadSate {
  gus: IDataGapperUploadExtended[];
  visibleRows: IDataGapperUploadExtended[];
};

export const dataUploadInitialState: IDataUploadSate = {
  gus: [],
  visibleRows: []
}
