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
    case 'enter at 10am':
      return data["Day 1 30Min Close"];
    case 'enter at 10:30am':
      return data["Day 1 60Min Close"];
    case 'enter at 11:00am':
      return data["Day 1 90Min Close"];
    case 'enter at 9:45am':
      return data["Day 1 15Min Close"];
    case 'enter at 9:35am':
      return data["Day 1 5Min Close"];
  }
}

export function addSlippageToEntry(entryPrice:number | undefined, config: ISimulationEngineConfig) : number | undefined {
  const slippage = config.entry_slippage;
  return entryPrice ? Number((entryPrice - (entryPrice * (slippage/100))).toFixed(2)) : undefined
}

export function getAvgEntryPrice(initialEntryPrice: number | undefined, initialShareCount: number, pyramidEntryPrice: number, pyramidShareCount: number): number | undefined {
  if (initialEntryPrice) {
    const totalDollarFirstEntry = initialEntryPrice * initialShareCount;
    const totalDollarSecondEntry = pyramidEntryPrice * pyramidShareCount;
    const totalShares = initialShareCount + pyramidShareCount;
    return Number(((totalDollarFirstEntry + totalDollarSecondEntry)/ totalShares).toFixed(2));
  }
  return undefined;
}

export function getPyramidEntryPrice(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const pyramidAt = config.pyramid;
  switch(pyramidAt) {
    case 'add at 10am close':
      return data["Day 1 30Min Close"];
    case 'add at 10:30am close':
      return data["Day 1 60Min Close"];
    case 'add at 11am close':
      return data["Day 1 90Min Close"];
    case 'add at 11:30am close':
      return data["Day 1 120Min Close"];
    case '10:30am + 11am combo':
    default:
      if (data["Day 1 60Min Close"] < data["Day 1 Open"]) {
        return data["Day 1 60Min Close"];
      }
      return data["Day 1 90Min Close"];
  }
}

export function getPyramidEntryPriceRisk(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const pyramidAt = config.pyramid;
  switch(pyramidAt) {
    case 'add at 10am close':
      return data["Day 1 30Min High"];
    case 'add at 10:30am close':
      return data["Day 1 60Min High"];
    case 'add at 11am close':
      return data["Day 1 90Min High"];
    case 'add at 11:30am close':
      return data["Day 1 120Min High"];
    case '10:30am + 11am combo':
    default:
      if (data["Day 1 60Min Close"] < data["Day 1 Open"]) {
        return data["Day 1 60Min High"];
      }
      return data["Day 1 90Min High"];
  }
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
