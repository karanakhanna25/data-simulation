import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { extractFibLevel, getRiskTimeFrameHighValue } from "./common.utils";

export function getEntryPrice(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number | undefined {
  const enterAt = config.enter_at;
  const timeFrameHigh = getRiskTimeFrameHighValue(config.riskTimeFrame, data);
  switch(enterAt) {
    case 'push from open':
      const pushPercentEntryPriceFromOpen = getPushPercentEntryPriceFromOpen(config, data);
      return getPushPercentEntryPrice(timeFrameHigh, pushPercentEntryPriceFromOpen);
    case '0.786 fib or push from open':
    default:
      return getEntryFromFibLevel(0.786, config, data);
    case '0.886 or push from open':
      return getEntryFromFibLevel(0.886, config, data);
    case 'enter at pmh':
      return getPushPercentEntryPrice(timeFrameHigh, data["Day 1 PM High"]);
  }
}

export function getEntryPriceWithSlippage(config: ISimulationEngineConfig, data: IDataGapperUploadExtended) : number | undefined {
  const entryPrice = getEntryPrice(config, data);
  const slippage = config.entry_slippage;
  return entryPrice ? Number((entryPrice - (entryPrice * (slippage/100))).toFixed(2)) : undefined
}

function getPushPercentEntryPriceFromOpen(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const push_percent = config.spike_percent_to_enter;
  const open = data["Day 1 Open"];
  return Number((open + (open * (push_percent/100))).toFixed(2));
}

function getEntryFromFibLevel(fibLevel: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number | undefined {
  const fibLevelPrice = extractFibLevel(fibLevel, data);
  const pushPercentEntryPriceFromOpen = getPushPercentEntryPriceFromOpen(config, data);
  const timeFrameHigh = getRiskTimeFrameHighValue(config.riskTimeFrame, data);
  if (data["Day 1 Open"] <= fibLevelPrice) {
    return getPushPercentEntryPrice(timeFrameHigh, fibLevelPrice);
  }
  return getPushPercentEntryPrice(timeFrameHigh, pushPercentEntryPriceFromOpen);
}

function getPushPercentEntryPrice(timeframeHigh: number, pushPercentEntryPrice: number): number | undefined {
  return timeframeHigh >= pushPercentEntryPrice ? pushPercentEntryPrice : undefined;
}
