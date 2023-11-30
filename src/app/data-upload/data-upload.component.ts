import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { IDataGapperUpload, IDataGapperUploadFields } from './data-upload.model';
import { FirebaseService } from './services/firebase.service';
import { DataUploadStore } from './stores/data-upload.store/data-upload.store';

@Component({
  selector: 'app-root',
  templateUrl: 'data-upload.component.html',
  styleUrl: 'data-upload.component.scss'
})
export class DataUploadComponent {

  constructor(private _store: DataUploadStore) {
    this._store.gusData$.subscribe(data => console.log(data))
  }

  onFileChanged(evt: Event): void {
    const target: DataTransfer = evt.target as unknown as DataTransfer;
    if (target.files.length !== 1) throw new Error('Upload One file at a time');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', cellDates: true});
      const sheetName = (workbook.SheetNames || [])[0] || undefined;
      if (sheetName) {
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const headers = jsonData[0] as string[];
        const data = this._mapToFields(jsonData.slice(1).reduce((acc: any, row: any) => {
          const rowObj = (row || []).reduce((obj: any, cell: any, index: number) => {
            obj[headers[index]] = cell;
            return obj;
          }, {});
          acc.push(rowObj);
          return acc;
        }, []) as IDataGapperUpload[]).map(d => ({...d, id: `${d['Day 1 Date']}-${d.Ticker}`})) as IDataGapperUpload[];
        this._store.uploadGusData(data);
      }
    }
    reader.readAsBinaryString(target.files[0]);
  }

  private _mapToFields(data: IDataGapperUpload[]): IDataGapperUpload[] {
    const fields = Object.keys(IDataGapperUploadFields);
    return data.map(d => {
      const dataKeys = Object.keys(d);
      return dataKeys.reduce((obj: any, key: string) => {
        if (fields.includes(key)) {
          obj[key] = d[key as keyof typeof d];
        }
        return obj;
      }, {})
    })
  }

}
