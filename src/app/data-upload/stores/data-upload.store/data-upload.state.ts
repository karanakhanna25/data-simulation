import { IDataGapperUpload } from "@app-data-upload/data-upload.model"

export interface IDataUploadSate {
  gus: IDataGapperUpload[]
};

export const dataUploadInitialState: IDataUploadSate = {
  gus: []
}
