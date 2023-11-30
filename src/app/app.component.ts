import { Component, OnInit } from '@angular/core';
import { DataUploadStore } from '@app-data-upload/stores/data-upload.store/data-upload.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DataUploadStore]
})
export class AppComponent implements OnInit {

  navLinks = [
    { path: 'data-upload', label: 'Data Upload' },
    { path: '/simulation', label: 'Simulation' },
  ];

  constructor(private _store: DataUploadStore) {}

  ngOnInit(): void {
    this._store.loadData()
  }

}
