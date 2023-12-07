import { Component, OnInit, Signal, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { SimulationDataStore } from "@app-simulation/store/data-upload.store";
import { ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { simulationEngineConfigInitialState } from "@app-simulation/store/simulation-config.state";
import { SimulationEngineConfigStore } from "@app-simulation/store/simulation-config.store";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map } from "rxjs";
import { LineChartComponent } from "src/app/charts/line-chart/line-chart.component";

@UntilDestroy()
@Component({
  selector: 'simulation-engine',
  templateUrl: 'simulation-engine.component.html',
  styleUrl: 'simulation-engine.component.scss',
})
export class SimulationEngineComponent implements OnInit {

  @ViewChild('lineChart')
  lineChart!: LineChartComponent;

  equity = this._store.equity as Signal<(number)[]>;

  readonly timeFrameOptions = [
    {value: 15, label: '9:45 a.m.'},
    {value: 30, label: '10:00 a.m.'},
    {value: 60, label: '10:30 a.m.'},
    {value: 90, label: '11:00 a.m.'},
    {value: 120, label: '11:30 a.m.'}
  ]

  readonly form = this._fb.group({
    equity: [simulationEngineConfigInitialState.config.equity, Validators.required],
    slippage: [simulationEngineConfigInitialState.config.slippage, Validators.required],
    locate: [simulationEngineConfigInitialState.config.locate, Validators.required],
    cappedRisk: [],
    riskTimeFrame: [simulationEngineConfigInitialState.config.riskTimeFrame, Validators.required],
    wiggle_room: [simulationEngineConfigInitialState.config.wiggle_room, Validators.required],
    spike_percent_risk: [simulationEngineConfigInitialState.config.spike_percent_risk, Validators.required],
    first_risk:[simulationEngineConfigInitialState.config.first_risk, Validators.required],
    first_entry_spike: [0, Validators.required],
    first_open_size: [simulationEngineConfigInitialState.config.first_open_size, Validators.required],
    exit_lows: [],
    shares_exit_close: [simulationEngineConfigInitialState.config.shares_exit_close, Validators.required],
    shares_exit_lows: [simulationEngineConfigInitialState.config.shares_exit_lows, Validators.required]
  });

  constructor(private _fb: FormBuilder, private _store: SimulationDataStore, private _configStore: SimulationEngineConfigStore) {}

  ngOnInit(): void {
    this._configStore.updateSimulationConfig(this.form.value as unknown as ISimulationEngineConfig);

    this._updateExitLowPercentShareControl(this._percentSharesExitCloseControl().value);
    this._updateExitLowControl(this._percentSharesExitLowControl().value);
    this._updateExitClosePercentShareControl(this._percentSharesExitLowControl().value);
    this._updateFirstEntrySpike(this._percentSharesExitLowControl().value);

    this._percentSharesExitCloseControl()?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this._updateExitLowPercentShareControl(data);
      this._updateExitLowControl(this._percentSharesExitLowControl().value);
    });

    this._percentSharesExitLowControl()?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this._updateFirstEntrySpike(data);
      this._updateExitLowControl(data);
      this._updateExitClosePercentShareControl(data);
    });


    this.form.valueChanges.pipe(
      map(data => data as unknown as ISimulationEngineConfig),
      untilDestroyed(this)
    ).subscribe((config: ISimulationEngineConfig) => {
      this._configStore.updateSimulationConfig(config);
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

  private _updateExitLowPercentShareControl(exitCloseValue: number): void {
    if (exitCloseValue === 100) {
      this._percentSharesExitLowControl().reset();
      this._percentSharesExitLowControl().setValue(0, {emitEvent: false});
    } else {
      this._percentSharesExitLowControl().setValue(100 - exitCloseValue, {emitEvent: false});
    }
  }

  private _updateExitClosePercentShareControl(exitLowValue: number): void {
    if (exitLowValue === 100) {
      this._percentSharesExitCloseControl().reset();
      this._percentSharesExitCloseControl().setValue(0, {emitEvent: false});
    } else {
      this._percentSharesExitCloseControl().setValue(100 - exitLowValue, {emitEvent: false});
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
    return this.form.get('first_entry_spike') as AbstractControl;
  }

  portfolio_equity(): number[] {
    return this.equity() as number[];
  }
}
