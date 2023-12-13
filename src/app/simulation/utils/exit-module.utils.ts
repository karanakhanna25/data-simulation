
export function calculateProfitLoss(entry: number, exit: number, shares: number): number {
  return Number((shares * (entry - exit)).toFixed(2));
}
