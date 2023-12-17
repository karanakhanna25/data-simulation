import { IDataGapperUploadExtended } from "@app-simulation/simulation.model";

export function extractFibLevel(level: number, data: IDataGapperUploadExtended): number{
  return Number((((data['Day 1 PM High'] - data['Day -1 Close'])*level) + data['Day -1 Close']).toFixed(2));
}

export function getRiskTimeFrameHighValue(timeFrame: number, data: IDataGapperUploadExtended): number {
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
    case 999:
      return data["Day 1 High"];
  }
}

export function getRiskTimeFrameCloseValue(timeFrame: number, data: IDataGapperUploadExtended): number {
  switch (timeFrame) {
    case 15:
      return data["Day 1 15Min Close"];
    case 30:
      return data["Day 1 30Min Close"];
    case 60:
      return data["Day 1 60Min Close"];
    case 90:
      default:
      return data["Day 1 90Min Close"];
    case 120:
      return data["Day 1 120Min Close"];
    case 999:
      return data["Day 1 Close"];
  }
}

export function getOpenRelativeToFibLevel(data: IDataGapperUploadExtended): 'Between' | 'Under' | 'Above' | undefined {
  const fibLevel0786 = extractFibLevel(0.786, data);
  const fibLevel0886 = extractFibLevel(0.886, data);
  const open = data["Day 1 Open"];
  if (open >= fibLevel0786 && open <= fibLevel0886) {
    return 'Between'
  }

  if (open > fibLevel0886) {
    return 'Above';
  }

  if (open < fibLevel0786) {
    return 'Under'
  }
  return undefined;
}
