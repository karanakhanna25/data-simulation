// lightweight-chart.component.ts

import { formatDate } from '@angular/common';
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
        const estTimestamp = item.t + (this._offset(this.date) * 60 * 60 * 1000); // Subtract 5 hours
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

  private _offset(date: string): number {
    const stdTimezoneOffset = () => {
      var jan = new Date(0, 1)
      var jul = new Date(6, 1)
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    }

  var today = new Date(formatDate(date, 'MM-dd-yyyy', 'en-US'));

    const isDstObserved = (today: Date) => {
        return today.getTimezoneOffset() < stdTimezoneOffset()
    }

    if (isDstObserved(today)) {
        return -4
    } else {
        return -5
    }
  }

  private _isDST(date: Date) {
    const march = 2; // March (0-indexed)
    const november = 10; // November (0-indexed)
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    if (month < march || month > november) {
        return false; // Not DST
    }
    if (month > march && month < november) {
        return true; // DST
    }
    if (month === march) {
        // Second Sunday in March
        const secondSunday = dayOfWeek === 0 && day >= 8 && day <= 14;
        return day > 14 || secondSunday;
    }
    if (month === november) {
        // First Sunday in November
        const firstSunday = dayOfWeek === 0 && day <= 7;
        return !firstSunday;
    }
    return false;
  }
}
