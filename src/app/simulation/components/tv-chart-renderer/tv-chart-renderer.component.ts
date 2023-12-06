// lightweight-chart.component.ts

import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PolygonService } from '@app-simulation/services/polygon.service';
import { createChart, CandlestickSeriesPartialOptions, UTCTimestamp } from 'lightweight-charts';
import { take } from 'rxjs';


@Component({
  selector: 'tv-lightweight-chart',
  template: `<div #chartContainer style="width: 800px; height: 400px;"></div>`,
})
export class TVLightweightChartComponent implements OnInit {

  @Input()
  date!: string;

  @Input()
  ticker!: string;

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor(private polygonService: PolygonService) {}

  ngOnInit() {
    this.polygonService.getIntradayData(this.ticker, this.date).pipe(
      take(1)
    ).subscribe(data => {
      const chart = createChart(this.chartContainer.nativeElement, { width: 800, height: 400, timeScale: {
        timeVisible: true,
        secondsVisible: false, // set true if you want to see seconds
      }, });
      const candleSeries = chart.addCandlestickSeries({

      } as CandlestickSeriesPartialOptions);

      const formattedData = data.results.map(item => {
        // Convert to UTC
        const estTimestamp = item.t - (4 * 60 * 60 * 1000); // Subtract 5 hours
        return {
          time: Math.floor(estTimestamp/1000) as UTCTimestamp, // Convert timestamp to seconds
          open: item.o, // Opening price
          high: item.h, // High price
          low: item.l, // Low price
          close: item.c // Closing price
        }
      });

      candleSeries.setData(formattedData);
    });
  }
}
