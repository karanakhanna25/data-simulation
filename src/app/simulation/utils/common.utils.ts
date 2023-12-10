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
