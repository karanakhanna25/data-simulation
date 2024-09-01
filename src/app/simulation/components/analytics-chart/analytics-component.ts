import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { map, Observable } from "rxjs";
import { IScatterPlotData } from "./scatter-plot/scatter-plot-chart.component";
import { IDataGapperUploadExtended } from '../../simulation.model';
import { untilDestroyed, UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'analytics',
  templateUrl: 'analytics-component.html',
  styleUrl: 'analytics-component.scss',
})
export class AnalyticsComponent implements OnInit {

  data$!: Observable<IScatterPlotData[]>;

  readonly timeFrameOptions = [
    {value: '10:30am Spike %', label: '10:30am Spike %'},
    {value: 'HOD Spike %', label: 'HOD Spike %'},
    {value: '10:30am Low %', label: '10:30am Low %'},
    {value: 'LOD drop %', label: 'LOD drop %'},
  ];

  form!: FormGroup;

  scatterData = [
    { x: 30, y: 20 },
    { x: 50, y: 40 },
    { x: 70, y: 90 },
    { x: 90, y: 60 },
    { x: 110, y: 80 }
  ];

  constructor(private _fb: FormBuilder, private _store: SimulationDataStore) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      timeFrame: [this.timeFrameOptions[0].value],
    });

    this.setScatterPlotData(this.form.get('timeFrame')?.value);

    this.form.get('timeFrame')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((timeframe) => {
      this.setScatterPlotData(timeframe)
    });
  }


  setScatterPlotData(timeframe: string): void {
    this.data$ = this._store.visibleRows$.pipe(
      map((data) => {
        return data.map((d, i) => {
          return {
           x: i,
           y: this.getValueForTimeFrame(timeframe, d)
          }
        })
      })
    );
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
      default:
        return 0;
    }
  }

}
