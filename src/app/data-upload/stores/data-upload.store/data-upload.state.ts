import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model"

export interface IDataUploadSate {
  gus: IDataGapperUploadExtended[];
  visibleRows: IDataGapperUploadExtended[];
};

export const dataUploadInitialState: IDataUploadSate = {
  gus: [],
  visibleRows: []
}
