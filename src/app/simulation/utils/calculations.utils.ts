import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";


export function avgPercentForTimeFrame(timeFrame: string, filteredRows: IDataGapperUploadExtended[]): number {
  const openToTimeFrameHighPercent = filteredRows.map(r => {
    const timeFrameHigh = (r[timeFrame as keyof typeof r] as number);
    return Number(((timeFrameHigh - r['Day 1 Open'])/r['Day 1 Open']*100).toFixed(2));
  });
  const totalSum = openToTimeFrameHighPercent.reduce((acc, cur) => acc + cur, 0);
  return Number(((totalSum)/filteredRows.length).toFixed(2)) || 0;
}


export function medianPercentForTimeFrame(timeFrame: string, filteredRows: IDataGapperUploadExtended[]): number {
  const openToTimeFrameHighPercent = filteredRows.map(r => {
    const timeFrameHigh = (r[timeFrame as keyof typeof r] as number);
    return Number(((timeFrameHigh - r['Day 1 Open'])/r['Day 1 Open']*100).toFixed(2));
  });
  return findMedian(openToTimeFrameHighPercent);
}

function findMedian(arr: number[]): number {
  // Sort the array
  arr.sort((a, b) => a - b);

  const midIndex = Math.floor(arr.length / 2);

  // Check if the array has an odd number of elements
  if (arr.length % 2 !== 0) {
    // If odd, return the middle element
    return arr[midIndex];
  } else {
    // If even, return the average of the two middle elements
    return (arr[midIndex - 1] + arr[midIndex]) / 2;
  }
}
