import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { getRiskTimeFrameCloseValue, getRiskTimeFrameHighValue } from "./common.utils";

export function calculateProfitLoss(entry: number, exit: number, shares: number): number {
  return Number((shares * (entry - exit)).toFixed(2));
}

export function calculateSharesToCoverAtClose(totalSharesForTrade: number, config: ISimulationEngineConfig): number {
  const percentShares = config.shares_exit_close;
  return Number((totalSharesForTrade * (percentShares/100)).toFixed(0));
}

export function calculateSharesToCoverAtLows(totalSharesForTrade: number, config: ISimulationEngineConfig): number {
  const percentShares = config.shares_exit_lows;
  return Number((totalSharesForTrade * (percentShares/100)).toFixed(0));
}

export function getExitPriceForClose(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const riskBreakPrice = getRiskBreakLevelPrice(maxLossLevel,data, config);
  if (!riskBreakPrice) {
    return data["Day 1 Close"];
  }
  return riskBreakPrice;
}

export function getExitPriceForCloseWithSlippage(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const slippage = config.exit_slippage;
 const closePrice = getExitPriceForClose(maxLossLevel, config ,data);
 return Number((closePrice + (closePrice * (slippage/100))).toFixed(2));
}

export function getExitPriceForLowWithSlippage(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const slippage = config.exit_slippage;
 const lowPrice = getExitPriceForLows(maxLossLevel, config ,data);
 return Number((lowPrice + (lowPrice * (slippage/100))).toFixed(2));
}

export function getExitPriceForLows(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const riskBreakPrice = getRiskBreakLevelPrice(maxLossLevel,data, config);
  if (!riskBreakPrice) {
    const open = data["Day 1 Open"];
    const lowPercent = config.exit_lows || 0;
    const lowPrice = Number((open - (open * (lowPercent/100))).toFixed(2));
    if (data["Day 1 Low"] <= lowPrice) {
      return lowPrice;
    }
    return data["Day 1 Close"];
  }
  return riskBreakPrice;
}

function getRiskBreakLevelPrice(maxLossLevel: number, data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number | undefined {
  const timeFrameHigh = getRiskTimeFrameHighValue(config.riskTimeFrame, data);
  if (timeFrameHigh > maxLossLevel) {
    return maxLossLevel;
  }

  if (data["Day 1 High"] > timeFrameHigh) {
    return timeFrameHigh;
  }
  return undefined;
}


