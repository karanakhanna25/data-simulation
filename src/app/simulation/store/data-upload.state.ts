import { ISimualationDay2GUSExtended } from "@app-simulation-day2-gus/simulation-day2-gus.model";
import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

export interface IDataUploadSate {
  allRecords: IDataGapperUploadExtended[] |  ISimualationDay2GUSExtended[];
  visibleRows: IDataGapperUploadExtended[] |  ISimualationDay2GUSExtended[];
};

export const dataUploadInitialState: IDataUploadSate = {
  allRecords: [],
  visibleRows: []
}
