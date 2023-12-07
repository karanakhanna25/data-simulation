import { CommonModule, formatDate } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'excel-file-name',
  templateUrl: 'excel-file-input-dialog.component.html',
  styleUrls: ['excel-file-input-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class ExcelFileNameInputDialogComponent  {

  fileName: string = '';

  constructor(public dialogRef: MatDialogRef<ExcelFileNameInputDialogComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }

  export(): void {
    const date = new Date();
    this.dialogRef.close(`${this.fileName}_${formatDate(date, 'MM/dd/yyyy', 'en-US').split('/').join('_')}`);
  }
}
