import { NgModule } from '@angular/core';
import { DataUploadComponent } from './data-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DataUploadRoutingModule } from './data-upload-routing.module';

@NgModule({
  declarations: [
    DataUploadComponent,
  ],
  imports: [
    DataUploadRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class DataUploadModule { }
