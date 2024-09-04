import { Component, OnInit, Signal, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { simulationEngineConfigInitialState } from "@app-simulation/store/simulation-config.state";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map } from "rxjs";
import { LineChartComponent } from "src/app/charts/line-chart/line-chart.component";
import { CommonModule } from "@angular/common";
import { ChartModule } from "src/app/charts/chart.module";

@UntilDestroy()
@Component({
  selector: 'simulation-engine',
  templateUrl: 'simulation-engine.component.html',
  styleUrl: 'simulation-engine.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChartModule]
})
export class SimulationEngineComponent implements OnInit {

  @ViewChild('lineChart')
  lineChart!: LineChartComponent;

  equity = (this._store.equity as Signal<(number)[]>);
  equity$ = this._store.equity$.pipe(
    map(data => data.map((d, i) => ({x: i.toString(), y: d as number})))
   );

  readonly timeFrameOptions = [
    {value: 15, label: '9:45 a.m.'},
    {value: 30, label: '10:00 a.m.'},
    {value: 60, label: '10:30 a.m.'},
    {value: 90, label: '11:00 a.m.'},
    {value: 120, label: '11:30 a.m.'},
    {value: 999, label: 'Max Loss'}
  ]

  readonly riskFromoptions = [
    {value: 'risk gap %', label: 'risk gap %'},
    {value: 'risk 50% of gap %', label: 'risk 50% of gap %'},
    {value: 'risk from open', label: 'risk from open'},
    {value: 'risk from 9:45am High', label: 'risk from 9:45am High'},
    {value: 'risk from 10am High', label: 'risk from 10am High'},
    {value: 'risk from 10:30 High', label: 'risk from 10:30 High'},
    {value: 'risk from 0.886 Fib level', label: 'risk from 0.886 fib level'},
    {value: 'risk from 0.786 Fib level', label: 'risk from 0.786 fib level'},
    {value: 'risk from pmh', label: 'risk from pmh'},
    {value: 'use pmh as risk', label: 'use pmh as risk'},
    {value: 'use 9:45am high as risk', label: 'use 9:45am high as risk'},
    {value: 'use 10am high as risk', label: 'use 10am high as risk'},
    {value: 'use 10:30am high as risk', label: 'use 10:30am high as risk'},
    {value: 'use 11am high as risk', label: 'use 11am high as risk'},
    {value: 'use 11:30am high as risk', label: 'use 11:30am high as risk'},
    {value: 'use prev day close as risk', label: 'use prev day close as risk'},
  ]

  readonly exitAtTimeOptions = [
    {value: 'exit at 10:30am', label: 'exit at 10:30am'},
    {value: 'exit at 11am', label: 'exit at 11am'},
    {value: 'exit at 11:30am', label: 'exit at 11:30am'},
  ]

  readonly enterAtOptions = [
    {value: 'push from open', label: 'push from open'},
    {value: '0.786 fib or push from open', label: '0.786 fib or push from open'},
    {value: '0.886 or push from open', label: '0.886 or push from open'},
    {value: 'enter at pmh', label: 'enter at pmh'},
    {value: 'enter at 9:35am', label: 'enter at 9:35am'},
    {value: 'enter at 9:45am', label: 'enter at 9:45am'},
    {value: 'enter at 10am', label: 'enter at 10am'},
    {value: 'enter at 10:30am', label: 'enter at 10:30am'},
    {value: 'enter at 11:00am', label: 'enter at 11:00am'},
    {value: 'enter at 11:30am', label: 'enter at 11:30am'}
  ]

  readonly pyramidOptions = [
    {value: 'add at 10am close', label: 'add at 10am close'},
    {value: 'add at 10:30am close', label: 'add at 10:30am close'},
    {value: 'add at 11am close', label: 'add at 11am close'},
    {value: 'add at 11:30am close', label: 'add at 11:30am close'},
    {value: '10:30am + 11am combo', label: '10:30am + 11am combo'},
    {value: 'no adds', label: 'no adds'}
  ]

  readonly form = this._fb.group({
    equity: [simulationEngineConfigInitialState.config.equity, Validators.required],
    entry_slippage: [simulationEngineConfigInitialState.config.entry_slippage, Validators.required],
    exit_slippage: [simulationEngineConfigInitialState.config.exit_slippage, Validators.required],
    locate: [simulationEngineConfigInitialState.config.locate, Validators.required],
    cappedRisk: [simulationEngineConfigInitialState.config.cappedRisk, Validators.required],
    riskTimeFrame: [simulationEngineConfigInitialState.config.riskTimeFrame, Validators.required],
    risk_from: [simulationEngineConfigInitialState.config.risk_from, Validators.required],
    wiggle_room: [simulationEngineConfigInitialState.config.wiggle_room, Validators.required],
    max_loss_spike_percent: [simulationEngineConfigInitialState.config.max_loss_spike_percent, Validators.required],
    locate_offset: [simulationEngineConfigInitialState.config.locate_offset, Validators.required],
    enter_at: [simulationEngineConfigInitialState.config.enter_at, Validators.required],
    max_loss_risk_percent:[simulationEngineConfigInitialState.config.max_loss_risk_percent, Validators.required],
    spike_percent_to_enter: [simulationEngineConfigInitialState.config.spike_percent_to_enter, Validators.required],
    pyramid: [simulationEngineConfigInitialState.config.pyramid, Validators.required],
    no_extra_locates: [simulationEngineConfigInitialState.config.no_extra_locates, Validators.required],
    exit_lows: [],
    shares_exit_close: [simulationEngineConfigInitialState.config.shares_exit_close, Validators.required],
    shares_exit_lows: [simulationEngineConfigInitialState.config.shares_exit_lows, Validators.required],
    shares_exit_time: [simulationEngineConfigInitialState.config.shares_exit_time, Validators.required],
    exit_at_time: [simulationEngineConfigInitialState.config.exit_at_time, Validators.required]
  });

  constructor(private _fb: FormBuilder, private _store: SimulationDataStore, private _configStore: SimulationEngineConfigStore) {}

  ngOnInit(): void {
    this._configStore.updateSimulationConfig(this.form.value as unknown as ISimulationEngineConfig);
    this._updateExitLowControl(this._percentSharesExitLowControl().value);
    this._updateFirstEntrySpike(this._percentSharesExitLowControl().value);

    this._percentSharesExitCloseControl()?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this._updateExitLowControl(this._percentSharesExitLowControl().value);
    });

    this._percentSharesExitLowControl()?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this._updateFirstEntrySpike(data);
      this._updateExitLowControl(data);
    });


    this.form.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((config) => {
      this._configStore.updateSimulationConfig(config as ISimulationEngineConfig);
    })
  }

  private _updateFirstEntrySpike(exitLowsPercentShare: number) {
    if (exitLowsPercentShare > 0) {
      this._firstSpikeEntryPercentControl().setValue(0);
      this._firstSpikeEntryPercentControl().disable();
    } else {
      this._firstSpikeEntryPercentControl().enable();
    }
  }

  private _updateExitLowControl(exitLowShareValue: number): void {
    if (exitLowShareValue > 0) {
      if (!this._exitLowsControl().value) {
        this._exitLowsControl().setValue(-10);
      }
      this._exitLowsControl().setValidators(Validators.required);
      this._exitLowsControl().enable();
    } else if(!exitLowShareValue) {
      this._exitLowsControl().reset();
      this._exitLowsControl().disable();
    }
  }

  private _exitLowsControl(): AbstractControl<number> {
    return this.form.get('exit_lows') as AbstractControl;
  }

  private _percentSharesExitCloseControl(): AbstractControl<number> {
    return this.form.get('shares_exit_close') as AbstractControl;
  }

  private _percentSharesExitLowControl(): AbstractControl<number> {
    return this.form.get('shares_exit_lows') as AbstractControl;
  }

  private _firstSpikeEntryPercentControl(): AbstractControl<number> {
    return this.form.get('spike_percent_to_enter') as AbstractControl;
  }

  portfolio_equity(): number[] {
    return this.equity() as number[];
  }
}
