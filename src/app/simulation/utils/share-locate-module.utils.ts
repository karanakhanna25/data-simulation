import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { extractFibLevel } from "./common.utils";
import { calculateRisk } from "./risk-module.utils";
import { calculateProfitLoss } from "./exit-module.utils";

export function premarketLocateShareCount(equity: number, data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number {
  const fibLevel = extractFibLevel(0.786, data);
  const riskLevel = calculateRisk(fibLevel, config);
  const locateOffset = config.locate_offset;
  const locateShareCount = getShareCount(fibLevel, riskLevel, equity, config);
  return locateShareCount * locateOffset;
}

export function getTotalSharesAtEntry(maxLossRiskLevel: number, entryPrice: number | undefined, equity: number, data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number {
  if (entryPrice) {
    const premktLocateShareCount = premarketLocateShareCount(equity, data, config);
    const numberofsharesAtEntry = getShareCount(entryPrice, maxLossRiskLevel, equity, config);
    const shareCount = numberofsharesAtEntry > premktLocateShareCount ? premktLocateShareCount : numberofsharesAtEntry;
    return adjustSharesForEntryBasedOnEquity(entryPrice, shareCount, equity);
  }
  return 0;
}

export function getTotalSharesAfterPyramid(sharesTakenAtEntry: number, entryPrice: number | undefined, equity: number,
  data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number {
    if (config.pyramid !== 'no adds' && entryPrice) {
      const premktLocateShareCount = premarketLocateShareCount(equity, data, config);
      const canBorrowMoreshares = !config.no_extra_locates;
      const pyramidEntryPrice = getPyramidAddPrice(config, data);
      const timeFrameHighAfterPyramid = getPyramidAddPriceRisk(config, data);
      const totalTradeDollarRisk = getDollarRisk(config, equity);
      const dollarRiskUsedAtInitialEntry = calculateProfitLoss(entryPrice, timeFrameHighAfterPyramid, sharesTakenAtEntry);
      const dollarRiskLeft = totalTradeDollarRisk + dollarRiskUsedAtInitialEntry;
      const initialEntryDollarValue = sharesTakenAtEntry * entryPrice;
      const equityLeft = equity - initialEntryDollarValue;
      if (dollarRiskLeft > 0) {
        const remainingSharesSharesForNewDollarRisk = getShareCountForDollarRisk(pyramidEntryPrice, timeFrameHighAfterPyramid, dollarRiskLeft);;
        if (canBorrowMoreshares) {
          return adjustSharesForEntryBasedOnEquity(pyramidEntryPrice, remainingSharesSharesForNewDollarRisk, equityLeft);
        } else {
          const remainingShares = premktLocateShareCount - sharesTakenAtEntry;
          if (remainingShares > 0) {
            const shares = remainingShares < remainingSharesSharesForNewDollarRisk ? remainingShares : remainingSharesSharesForNewDollarRisk;
            return adjustSharesForEntryBasedOnEquity(pyramidEntryPrice, shares, equityLeft);
          } else {
            return 0;
          }
        }
      }
    }
  return 0;
}

export function calculatePremartketLocateCost(equity: number, data: IDataGapperUploadExtended, config: ISimulationEngineConfig): number {
  const premktLocateShareCount = premarketLocateShareCount(equity, data, config);
  const locatecostPercent = config.locate;
  const fibLevel = extractFibLevel(0.786, data);
  const pricePerShare = Number((fibLevel * (locatecostPercent/100)).toFixed(2));
  return Number((premktLocateShareCount * pricePerShare).toFixed(2));
}

export function calculateLocateCostAfterPyramid(totalsharesForPyramid: number, totalSharesAtEntry: number, totalSharesLocated: number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const pyramidAddPrice = getPyramidAddPrice(config, data);
  const sharesRemainingAfterEntry = totalSharesLocated - totalSharesAtEntry;
  const sharesToCalculateLocatePriceOn = Math.abs(sharesRemainingAfterEntry-totalsharesForPyramid);
  const locatecostPercent = config.locate;
  const pricePerShare = Number((pyramidAddPrice * (locatecostPercent/100)).toFixed(2));
  return Number((sharesToCalculateLocatePriceOn * pricePerShare).toFixed(2));
}

function adjustSharesForEntryBasedOnEquity(entryPrice: number, shareCount: number, equity: number): number {
  const dollarValueOFEntryShares = entryPrice * shareCount;
  if (dollarValueOFEntryShares > equity) {
    return Number((equity/entryPrice).toFixed(0));
  }
  return shareCount;
}

function getShareCount(entry: number, exit: number, equity: number, config: ISimulationEngineConfig): number {
  const dollarRisk = getDollarRisk(config, equity);
  return Number((dollarRisk/(exit - entry)).toFixed(0));
}

function getShareCountForDollarRisk(entry: number, exit: number, dollarRisk: number): number {
  return Number((dollarRisk/(exit - entry)).toFixed(0));
}

function getDollarRisk(config: ISimulationEngineConfig, equity: number): number {
  const maxLossRiskPercent = config.max_loss_risk_percent;
  return Number((equity * (maxLossRiskPercent/100)).toFixed(0));
}

function getPyramidAddPrice(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
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

function getPyramidAddPriceRisk(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
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
