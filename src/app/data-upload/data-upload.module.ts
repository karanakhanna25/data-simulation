import { NgModule } from '@angular/core';
import { DataUploadComponent } from './data-upload.component';
import { DataUploadRoutingModule } from './data-upload-routing.module';
import {MatButtonModule} from '@angular/material/button';
import { FirebaseService } from './services/firebase.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DataUploadComponent,
  ],
  imports: [
    DataUploadRoutingModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [FirebaseService],
  bootstrap: []
})
export class DataUploadModule { }
