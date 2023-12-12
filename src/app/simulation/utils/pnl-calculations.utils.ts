import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { extractFibLevel, getOpenRelativeToFibLevel, getRiskTimeFrameHighValue } from "./common.utils";

export function calculatePnl(config: ISimulationEngineConfig, data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
  const globalEquity = [config.equity];
 return data.map((d, i) => {
    const firstEntryPrice = calculateFirstEntry(config, d);
    const timeFrameRiskPrice = getRiskTimeFrameHighValue(config.riskTimeFrame, d);
    const totalShares = calculateTotalShares(firstEntryPrice, globalEquity[i], config, d);
    const totalShareForLocate = calculateTotalSharesForLocate(d["Day 1 PM High"], globalEquity[i], config, d);
    const locatePerShare = perShareLocateCost(d["Day 1 PM High"], config);
    const totalLocate_cost = totalLocateCost(totalShareForLocate, locatePerShare);
    const firstExitPriceClose = calculateFirstExitPriceClose(firstEntryPrice, timeFrameRiskPrice, d, config) || 0;
    const firstExitPriceLow = calculateFirstExitPriceLows(firstEntryPrice, timeFrameRiskPrice, config, d) || 0;

    //values with slippage
    const firstEntryWithSlippage = addSlippage(firstEntryPrice, config, 'entry') || 0;

    // number of shares
    const totalShareClose = calculateShareCountForClose(totalShares, config);
    const totalSharesLow  = calculateShareCountForLows(totalShares, config);

    const pnlClose = calculateProfitLoss(totalShareClose, firstEntryWithSlippage, firstExitPriceClose);
    const pnlLow = calculateProfitLoss(totalSharesLow, firstEntryWithSlippage, firstExitPriceLow);
    const totalPnl = Number((pnlClose + pnlLow - totalLocate_cost).toFixed(2));

    const lastRecordEquity =  globalEquity[i];
    const equity = Number((lastRecordEquity + totalPnl).toFixed(2));
    globalEquity.push(Number(equity.toFixed(0)));

    return {...d, Equity: equity, "Profit/Loss": totalPnl};
  });


function calculateShareCountForClose(totalShares: number, config: ISimulationEngineConfig): number {
  return Number((totalShares * (config.shares_exit_close/100)).toFixed(2))
}

function calculateShareCountForLows(totalShares: number, config: ISimulationEngineConfig): number {
  return Number((totalShares * (config.shares_exit_lows/100)).toFixed(2))
}

function addSlippage(value: number | undefined, config: ISimulationEngineConfig, type: 'entry' | 'exit'): number | undefined {
  if (value) {
    if (type == 'entry') {
      return Number((value - (value * (config.slippage/100))).toFixed(2));
    }

    if (type === 'exit') {
      return Number((value + (value * (config.slippage/100))).toFixed(2));
    }
  }
  return undefined;
}

function calculateProfitLoss(totalShares: number, entry: number, exit: number): number {
  return totalShares * (entry - exit);
}

function calculateFirstEntry(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number | undefined  {
  const entry_spike_percent = config.first_entry_spike;
  const open = data["Day 1 Open"];
  const timeFrameHigh_percent = calculateRiskTimeframePercentSpike(config.riskTimeFrame, data);
  const timeFrameHighValue = getRiskTimeFrameHighValue(config.riskTimeFrame, data);
  const openRelativeToFibLevel = getOpenRelativeToFibLevel(data);
  const entryAfterSpike = Number((open + (open * (entry_spike_percent/100))).toFixed(2))
  if (openRelativeToFibLevel === 'Above') {
    if (timeFrameHighValue >= entryAfterSpike) {
      return entryAfterSpike;
    }
  }

  if (openRelativeToFibLevel === 'Between') {
    if (timeFrameHighValue >= entryAfterSpike) {
      return entryAfterSpike;
    }
  }

  if (openRelativeToFibLevel === 'Under') {
    const fibLevel0786 = extractFibLevel(0.786, data);
    if (timeFrameHighValue >= fibLevel0786) {
      return fibLevel0786;
    }
  }
  // if (timeFrameHigh_percent >= entry_spike_percent ) {
  //   return Number((open + (open * (entry_spike_percent/100))).toFixed(2));
  // }
  return undefined;
}

function getMaxLossRiskPrice(data: IDataGapperUploadExtended, fibLevel: number, config: ISimulationEngineConfig): number {
  const fibLevel0886 = extractFibLevel(fibLevel, data);
  const open = data["Day 1 Open"];
  const MaxLossPercent = config.spike_percent_risk;
  const fibLevelRisk = Number((fibLevel0886 + (fibLevel0886 * (MaxLossPercent/100))).toFixed(2));
  const openLevelRisk = Number((open + (open * (MaxLossPercent/100))).toFixed(2));
  return config.risk_from_open ? openLevelRisk : fibLevelRisk;
}

function getMaxLossRiskPriceWithWiggleRoom(data: IDataGapperUploadExtended, fibLevel: number, config: ISimulationEngineConfig): number {
  const wiggleRoom = config.wiggle_room;
  const riskLevel = getMaxLossRiskPrice(data, fibLevel, config);
  return Number((riskLevel + (riskLevel * (wiggleRoom/100))).toFixed(2));
}

function calculateFirstExitPriceClose(entryPrice: number | undefined, timeFrameRiskPrice: number, data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number | undefined {
  if (entryPrice) {
    const maxLossRiskPrice = getMaxLossRiskPriceWithWiggleRoom(data, 0.886, config)
    if (timeFrameRiskPrice > maxLossRiskPrice) {
      return addSlippage(maxLossRiskPrice, config, 'exit');
    }
    if (data["Day 1 High"] > timeFrameRiskPrice) {
      return addSlippage(timeFrameRiskPrice, config, 'exit');
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
      const maxLossRiskPrice = Number((data["Day 1 Open"] + (data["Day 1 Open"] * (config.spike_percent_risk/100))).toFixed(2));
      if (timeFrameRiskPrice > maxLossRiskPrice) {
        return addSlippage(maxLossRiskPrice, config, 'exit');
      }
      if (data["Day 1 High"] > timeFrameRiskPrice) {
        return addSlippage(timeFrameRiskPrice, config, 'exit');;
      }
      return data["Day 1 Close"];
    }
    return undefined;
  }
  return undefined;
}

function calculateTotalShares(entryPrice: number | undefined, equity: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  if (entryPrice) {
    const riskPrice = getMaxLossRiskPrice(data, 0.786, config);
    const portfolioEquity = equity;
    const dollarRisk = Number((portfolioEquity * (config.first_risk/100)).toFixed(0));
    const actualDollarRisk = dollarRisk <= config.cappedRisk ? dollarRisk : config.cappedRisk;
    return Number((actualDollarRisk/(riskPrice-entryPrice)).toFixed(0));
  }
  return 0;
}

function calculateTotalSharesForLocate(premktHigh:number, equity: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const portfolioEquity = equity;
  const riskPrice = getMaxLossRiskPrice(data, 0.786, config);
  const dollarRisk = Number((portfolioEquity * (config.first_risk/100)).toFixed(0));
  const actualDollarRisk = dollarRisk <= config.cappedRisk ? dollarRisk : config.cappedRisk;
  return Number((actualDollarRisk/(riskPrice-premktHigh)).toFixed(0)) * 2;
}

function perShareLocateCost(pmhPrice: number, config: ISimulationEngineConfig): number {
  const locatePercent = config.locate/100;
  return Number((pmhPrice*locatePercent).toFixed(2));
}

function totalLocateCost(totalShares: number, pricePerShare: number): number {
  return totalShares * pricePerShare;
}

function calculateRiskTimeframePercentSpike(timeFameHigh: number, data: IDataGapperUploadExtended): number {
  const open = data["Day 1 Open"];
  return Number(((getRiskTimeFrameHighValue(timeFameHigh, data) - open)/open*100).toFixed(2));
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
}
