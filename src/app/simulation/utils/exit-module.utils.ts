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

export function calculateSharesToCoverAtTime(totalSharesForTrade: number, config: ISimulationEngineConfig): number {
  const percentShares = config.shares_exit_time;
  return Number((totalSharesForTrade * (percentShares/100)).toFixed(0));
}

export function getExitPriceForCoverAtTime(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const riskBreakPrice = getRiskBreakLevelPrice(maxLossLevel,data, config);
  if (!riskBreakPrice) {
    const exitAtTime = config.exit_at_time;
    switch(exitAtTime) {
      case 'exit at 10:30am':
        return checkIfPriceAboveOpen(data["Day 1 60Min Close"], data);
      case 'exit at 11am':
        default:
        return checkIfPriceAboveOpen(data["Day 1 90Min Close"], data);
      case 'exit at 11:30am':
        return checkIfPriceAboveOpen(data["Day 1 120Min Close"], data);
    }
  }
  return riskBreakPrice;
}

function checkIfPriceAboveOpen(price: number, data: IDataGapperUploadExtended): number {
  const openPrice = data["Day 1 Open"];
  if (price >= openPrice) {
    return data["Day 1 Close"];
  }
  return price;
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

export function getExitPriceForTimeWithSlippage(maxLossLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const slippage = config.exit_slippage;
 const closePrice = getExitPriceForCoverAtTime(maxLossLevel, config ,data);
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


