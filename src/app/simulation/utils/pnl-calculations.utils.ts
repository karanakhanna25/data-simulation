import { IDataGapperUploadExtended } from "@app-data-upload/data-upload.model";
import { ISimulationEngineConfig } from "@app-simulation/simulation.model";

export function calculatePnl(config: ISimulationEngineConfig, data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
  console.log(data);
 return data.map((d, i) => {
    const firstEntryPrice = calculateFirstEntry(config, d);
    const timeFrameRiskPrice = getRiskTimeFrameHighValue(config.riskTimeFrame, d);
    const totalShares = calculateTotalShares(firstEntryPrice, timeFrameRiskPrice, data[i-1]?.equity, config);
    const totalShareForLocate = calculateTotalSharesForLocate(d["Day 1 PM High"], timeFrameRiskPrice, data[i-1]?.equity, config);
    const locatePerShare = perShareLocateCost(d["Day 1 PM High"], config);
    const totalLocate = totalLocateCost(totalShareForLocate, locatePerShare);
    const firstExitPriceClose = calculateFirstExitPriceClose(firstEntryPrice, timeFrameRiskPrice, d);
    const firstExitPriceLow = calculateFirstExitPriceLows(firstEntryPrice, timeFrameRiskPrice, config, d);
    console.log(d.Ticker, firstExitPriceClose, firstExitPriceLow);
    return d;
  });
}

function calculateFirstEntry(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number | undefined  {
  const entry_spike_percent = config.first_entry_spike;
  const open = data["Day 1 Open"];
  const timeFrameHigh_percent = calculateRiskTimeframePercentSpike(config.riskTimeFrame, data);
  if (timeFrameHigh_percent >= entry_spike_percent ) {
    return Number((open + (open * (entry_spike_percent/100))).toFixed(2));
  }
  return undefined;
}

function calculateFirstExitPriceClose(entryPrice: number | undefined, timeFrameRiskPrice: number, data: IDataGapperUploadExtended): number | undefined {
  if (entryPrice) {
    if (data["Day 1 High"] > timeFrameRiskPrice) {
      return timeFrameRiskPrice;
    }
    return data["Day 1 Close"];
  }
  return undefined;
}

function calculateFirstExitPriceLows(entryPrice: number | undefined, timeFrameRiskPrice: number, config:ISimulationEngineConfig, data: IDataGapperUploadExtended): number | undefined {
  if (entryPrice) {
    if (config.exit_lows) {
      const lowCoverPrice = Number((entryPrice + (entryPrice * (config.exit_lows)/100)).toFixed(2));
      const timeFrameLow = getRiskTimeFrameLowValue(config.riskTimeFrame, data);
      if (timeFrameLow <= lowCoverPrice) {
        return lowCoverPrice;
      }
      if (data["Day 1 High"] > timeFrameRiskPrice) {
        return timeFrameRiskPrice;
      }
      return data["Day 1 Close"];
    }
    return undefined;
  }
  return undefined;
}

function calculateTotalShares(entryPrice: number | undefined, riskPrice: number, equity: number | undefined, config: ISimulationEngineConfig): number {
  if (entryPrice) {
    const portfolioEquity = equity || config.equity;
    const dollarRisk = Number((portfolioEquity * (config.first_risk/100)).toFixed(0));
    return Number((dollarRisk/(riskPrice-entryPrice)).toFixed(0));
  }
  return 0;
}

function calculateTotalSharesForLocate(premktHigh:number, riskPrice: number, equity: number | undefined, config: ISimulationEngineConfig): number {
  const portfolioEquity = equity || config.equity;
  const dollarRisk = Number((portfolioEquity * (config.first_risk/100)).toFixed(0));
  return Number((dollarRisk/(riskPrice-premktHigh)).toFixed(0)) * 2;
}

function perShareLocateCost(pmhPrice: number, config: ISimulationEngineConfig): number {
  const locatePercent = config.locate/100;
  return pmhPrice*locatePercent;
}

function totalLocateCost(totalShares: number, pricePerShare: number): number {
  return totalShares * pricePerShare;
}

function calculateRiskTimeframePercentSpike(timeFameHigh: number, data: IDataGapperUploadExtended): number {
  const open = data["Day 1 Open"];
  return Number(((getRiskTimeFrameHighValue(timeFameHigh, data) - open)/open*100).toFixed(2));
}

function getRiskTimeFrameHighValue(timeFrame: number, data: IDataGapperUploadExtended): number {
  switch (timeFrame) {
    case 15:
      return data["Day 1 15Min High"];
    case 30:
      return data["Day 1 30Min High"];
    case 60:
      return data["Day 1 60Min High"];
    case 90:
      default:
      return data["Day 1 90Min High"];
    case 120:
      return data["Day 1 120Min High"];
  }
}

function getRiskTimeFrameLowValue(timeFrame: number, data: IDataGapperUploadExtended): number {
  switch (timeFrame) {
    case 15:
      return data["Day 1 5Min Low"];
    case 30:
      return data["Day 1 30Min Low"];
    case 60:
      return data["Day 1 60Min Low"];
    case 90:
      default:
      return data["Day 1 90Min Low"];
    case 120:
      return data["Day 1 120Min Low"];
  }
}
