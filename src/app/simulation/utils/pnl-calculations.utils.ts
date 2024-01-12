import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { getMaxLossRiskLevel, getRiskLevelWithWiggleRoom } from "./risk-module.utils";
import { addSlippageToEntry, getAvgEntryPrice, getEntryPrice, getPyramidEntryPrice } from "./entry-module.utils";
import { calculateLocateCostAfterPyramid, calculatePremartketLocateCost, getTotalSharesAfterPyramid, getTotalSharesAtEntry, premarketLocateShareCount } from "./share-locate-module.utils";
import { calculateSharesToCoverAtClose, calculateSharesToCoverAtLows, calculateSharesToCoverAtTime, getExitPriceForClose, getExitPriceForCloseWithSlippage, getExitPriceForLowWithSlippage, getExitPriceForLows, getExitPriceForTimeWithSlippage } from "./exit-module.utils";

export function calculatePnl(config: ISimulationEngineConfig, data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
  const globalEquity = [config.equity];
  return data.map((g, i) => {
    const equity = globalEquity[i];
    const pnl = deriveProfitLoss(g, config, equity);
    const newEquity = equity + pnl;
    globalEquity.push(newEquity);
    return {...g, 'Profit/Loss': pnl, 'Equity': newEquity};
  });
}


function deriveProfitLoss(g: IDataGapperUploadExtended, config: ISimulationEngineConfig, equity: number): number {
  const maxLossRiskLevel = getMaxLossRiskLevel(config, g);
  const entryPrice = getEntryPrice(config, g);
  const totalSharesLocatedPremkt = premarketLocateShareCount(equity, g,config);
  const totalSharesAtEntry = getTotalSharesAtEntry(maxLossRiskLevel, entryPrice, equity, g, config);
  const totalSharesForPyramid = getTotalSharesAfterPyramid(totalSharesAtEntry, entryPrice, equity, g, config);
  const locateCostPremarket = calculatePremartketLocateCost(equity, g, config);
  const locateCostAfterPyramid = calculateLocateCostAfterPyramid(totalSharesForPyramid, totalSharesAtEntry, totalSharesLocatedPremkt, config, g);
  const pyramidEntryPrice = getPyramidEntryPrice(config, g);
  const averageEntryPrice = getAvgEntryPrice(entryPrice, totalSharesAtEntry, pyramidEntryPrice, totalSharesForPyramid);
  const riskLevelWithWiggleRoom = getRiskLevelWithWiggleRoom(config, g);
  const totalSharesForTrade = totalSharesAtEntry + totalSharesForPyramid;
  const averageEntryPricewithSlippage = addSlippageToEntry(averageEntryPrice, config);

  const pnlForClose = getPnlForclose(riskLevelWithWiggleRoom, totalSharesForTrade, averageEntryPricewithSlippage, config, g);
  const pnlForLow = getPnlForLows(riskLevelWithWiggleRoom, totalSharesForTrade, averageEntryPricewithSlippage, config, g);
  const pnlForTimeCover = getPnlForTime(riskLevelWithWiggleRoom, totalSharesForTrade, averageEntryPricewithSlippage, config, g);
  const totalLocateCostForTrade = locateCostPremarket + locateCostAfterPyramid;
   return pnlForClose + pnlForLow + pnlForTimeCover - totalLocateCostForTrade;
}

function getPnlForclose(maxLossLevel: number, totalShares: number, entryPriceWithSlippage: number | undefined, config: ISimulationEngineConfig, g: IDataGapperUploadExtended): number {
  if (entryPriceWithSlippage) {
    const exitPriceCloseWithSlippage = getExitPriceForCloseWithSlippage(maxLossLevel, config, g);
    const shareCountforClose = calculateSharesToCoverAtClose(totalShares, config);
    return Number(((entryPriceWithSlippage - exitPriceCloseWithSlippage)*shareCountforClose).toFixed(2));
  }
  return 0;
}

function getPnlForTime(maxLossLevel: number, totalShares: number, entryPriceWithSlippage: number | undefined, config: ISimulationEngineConfig, g: IDataGapperUploadExtended): number {
  if (entryPriceWithSlippage) {
    const exitPriceCloseWithSlippage = getExitPriceForTimeWithSlippage(maxLossLevel, config, g);
    const shareCountforClose = calculateSharesToCoverAtTime(totalShares, config);
    return Number(((entryPriceWithSlippage - exitPriceCloseWithSlippage)*shareCountforClose).toFixed(2));
  }
  return 0;
}

function getPnlForLows(maxLossLevel: number, totalShares: number, entryPriceWithSlippage: number | undefined, config: ISimulationEngineConfig, g: IDataGapperUploadExtended): number {
  if (entryPriceWithSlippage) {
    const exitPriceLows = getExitPriceForLows(maxLossLevel, config, g);
    const exitPriceLowsWithSlippage = getExitPriceForLowWithSlippage(maxLossLevel, config, g);
    const shareCountForLows = calculateSharesToCoverAtLows(totalShares, config);
    return Number(((entryPriceWithSlippage - exitPriceLowsWithSlippage)*shareCountForLows).toFixed(2));
  }
  return 0;
}


