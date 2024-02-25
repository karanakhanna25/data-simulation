import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent  {

  navLinks = [
    { path: '/simulation-gus', label: 'Simulation - GUS (75%+)' },
    { path: '/simulation-day-2-gus', label: 'Simulation - Day 2 GUS (10+%)' },
    { path: '/simulation-low-gap-gus', label: 'Simulation - GUS (20%+ - 75%)' },
    { path: '/simulation-multiday-gapdown', label: 'Simulation multiday gapdown' },
    { path: '/simulation-gapdown', label: 'Simulation gapdown' },
    { path: '/simulation-combined-gus', label: 'Simulation GUS Combined' },
  ];

  constructor() {}


}
