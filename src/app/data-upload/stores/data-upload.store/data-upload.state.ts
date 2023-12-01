import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model"

export interface IDataUploadSate {
  gus: IDataGapperUploadExtended[]
};

export const dataUploadInitialState: IDataUploadSate = {
  gus: []
}
