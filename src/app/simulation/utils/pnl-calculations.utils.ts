import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { extractFibLevel, getOpenRelativeToFibLevel, getRiskTimeFrameHighValue } from "./common.utils";
import { getMaxLossRiskLevel, getRiskLevelWithWiggleRoom } from "./risk-module.utils";
import { getEntryPrice, getEntryPriceWithSlippage } from "./entry-module.utils";
import { calculateLocateCostAfterPyramid, calculatePremartketLocateCost, getTotalSharesAfterPyramid, getTotalSharesAtEntry, premarketLocateShareCount } from "./share-locate-module.utils";

export function calculatePnl(config: ISimulationEngineConfig, data: IDataGapperUploadExtended[]): IDataGapperUploadExtended[] {
  const globalEquity = [config.equity];
  return data.map((g, i) => {
    const equity = globalEquity[i];
    const maxLossRiskLevel = getMaxLossRiskLevel(config, g);
    const riskLevelWithWiggleRoom = getRiskLevelWithWiggleRoom(config, g);
    const entryPrice = getEntryPrice(config, g);
    const entryPriceWithSlippage = getEntryPriceWithSlippage(config, g);
    const totalSharesLocatedPremkt = premarketLocateShareCount(equity, g,config);
    const totalSharesAtEntry = getTotalSharesAtEntry(maxLossRiskLevel, entryPrice, equity, g, config);
    const totalSharesAfterPyramid = getTotalSharesAfterPyramid(totalSharesAtEntry, entryPrice, equity, g, config);
    const totalSharesForTrade = totalSharesAtEntry + totalSharesAfterPyramid;
    const locateCostPremarket = calculatePremartketLocateCost(equity, g, config);
    const locateCostAfterPyramid = calculateLocateCostAfterPyramid(totalSharesAfterPyramid, totalSharesAtEntry, totalSharesLocatedPremkt, config, g);
    const totalLocateCostForTrade = locateCostPremarket + locateCostAfterPyramid;
    return g;
  });
}
