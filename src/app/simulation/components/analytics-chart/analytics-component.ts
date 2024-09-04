import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { map, Observable, take } from "rxjs";
import { IScatterPlotData } from "./scatter-plot/scatter-plot-chart.component";
import { IDataGapperUploadExtended } from '../../simulation.model';
import { untilDestroyed, UntilDestroy} from "@ngneat/until-destroy";
import { ILineData } from "src/app/charts/line-chart/line-chart.component";
import { groupByCalendarMonths, groupByCalendarWeeks, groupByDate } from "./analytics.utils";

@UntilDestroy()
@Component({
  selector: 'analytics',
  templateUrl: 'analytics-component.html',
  styleUrl: 'analytics-component.scss',
})
export class AnalyticsComponent implements OnInit {

  data$!: Observable<IScatterPlotData[]>;
  marketCycleData$: Observable<ILineData[]> | undefined;

  readonly timeFrameOptions = [
    {value: '10:30am Spike %', label: '10:30am Spike %'},
    {value: 'HOD Spike %', label: 'HOD Spike %'},
    {value: '10:30am Low %', label: '10:30am Low %'},
    {value: 'LOD drop %', label: 'LOD drop %'},
    {value: 'Open-Close %', label: 'Open-Close %'},
    {value: 'high-close Fade %', label: 'high-close Fade %'},
    {value: 'max spike %', label: 'max spike %'},
    {value: 'max fade %', label: 'max fade %'}
  ];

  readonly typeOptions = [
    {value: 'date', label: 'Date'},
    {value: 'month', label: 'Month'},
    {value: 'week', label: 'Week'},
  ];

  form!: FormGroup;

  constructor(private _fb: FormBuilder, private _store: SimulationDataStore) {

  }

  ngOnInit(): void {
    this.form = this._fb.group({
      timeFrame: [this.timeFrameOptions[0].value],
      dateTimeframe: [this.timeFrameOptions[4].value],
      type: [this.typeOptions[0].value]
    });

    this.setScatterPlotData(this.form.get('timeFrame')?.value);
    this.setMarketCycleData(this.form.get('dateTimeframe')?.value, this.form.get('type')?.value);

    this.form.get('timeFrame')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((timeframe) => {
      this.setScatterPlotData(timeframe)
    });

    this.form.get('dateTimeframe')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((timeframe) => {
      this.setMarketCycleData(timeframe, this.form.get('type')?.value)
    });

    this.form.get('type')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((type) => {
      this.setMarketCycleData(this.form.get('dateTimeframe')?.value, type)
    });
  }


  setScatterPlotData(timeframe: string): void {
    this.data$ = this._store.visibleRows$.pipe(
      map((data) => {
        return data.map((d, i) => {
          return {
           x: i,
           y: this.getValueForTimeFrame(timeframe, d),
           tooltip: `<div>Date:${new Date(d["Day 1 Date"]).toISOString().split('T')[0]}</div>
             <div>Ticker:${d.Ticker}</div><div>Market Cap:${d["Market Cap"].toLocaleString()}</div><div>Float:${d.Float?.toLocaleString()}</div>
             <div>Sector:${d.Industry}</div><div>Previous Day:${d["Day -1 Close"]}</div>`
          }
        })
      })
    );
  }

  setMarketCycleData(timeframe: string, type: string): void {
    this.marketCycleData$ = this._store.visibleRows$.pipe(
      map(data => {
        switch(type) {
          case 'week':
            return this.convertToLineData(groupByCalendarWeeks(data, timeframe));
          case 'month':
            return this.convertToLineData(groupByCalendarMonths(data, timeframe));
          case 'date':
            return this.convertToLineData(groupByDate(data, timeframe));
          default:
            return this.convertToLineData(groupByCalendarWeeks(data, timeframe));
        }
      })
    )
  }

  convertToLineData(data: { [key: string]: { order: number, value: number } }): ILineData[] {
    return Object.keys(data).sort((a, b) => data[a].order - data[b].order).map((key) => {
      return {
        x: key,
        y: data[key].value
      }
    });
  }

  getValueForTimeFrame(timeframe: string, data: IDataGapperUploadExtended): number {
    switch(timeframe) {
      case '10:30am Spike %':
        return data["spike % 10:00am"];
      case 'HOD Spike %':
        return data["Open-High Spike%"];
      case '10:30am Low %':
        return Number(((data["Day 1 60Min Low"] - data['Day 1 Open'])/data['Day 1 Open']*100).toFixed(2));
      case 'LOD drop %':
        return Number(((data["Day 1 Low"] - data['Day 1 Open'])/data["Day 1 Open"]*100).toFixed(2));
      case 'Open-Close %':
        return Number(((data['Day 1 Close'] - data['Day 1 Open'])/data['Day 1 Open']*100).toFixed(2));
      case 'high-close Fade %':
        return Number(((data['Day 1 Close'] - data['Day 1 High'])/data['Day 1 High']*100).toFixed(2));
      default:
        return 0;
    }
  }

}
