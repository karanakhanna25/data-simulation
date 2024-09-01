import { IDataGapperUploadExtended, ISimulationEngineConfig } from "@app-simulation/simulation.model";
import { extractFibLevel } from "./common.utils";

export function calculateRisk(startingPoint:number, config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const maxLossSpikePercent = getMaxLossSpikePercentage(config, data);
  return Number((startingPoint + (startingPoint * (maxLossSpikePercent/100))).toFixed(2));
}


function getMaxLossSpikePercentage(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const riskFrom = config.risk_from;
  switch(riskFrom) {
    case 'risk gap %':
      return data["Day 1 Gap %"];
    case 'risk 50% of gap %':
      return data["Day 1 Gap %"]/2;
    default:
      return config.max_loss_spike_percent;
  }

}

export function getMaxLossRiskLevel(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const riskFrom = config.risk_from;
  switch(riskFrom) {
    case 'risk gap %':
      const open = data["Day 1 Open"];
      return open + (open * (data["Day 1 Gap %"]/100));
    case 'risk 50% of gap %':
      const open1 = data["Day 1 Open"];
      return open1 + (open1 * (data["Day 1 Gap %"]/100)/2);
    case 'risk from open':
      return calculateRisk(data["Day 1 Open"], config, data);
    case 'risk from 0.886 Fib level':
    default:
      return calculateRisk(extractFibLevel(0.886, data), config, data);
    case 'risk from 0.786 Fib level':
      return calculateRisk(extractFibLevel(0.786, data), config, data);
    case 'risk from pmh':
      return calculateRisk(data["Day 1 PM High"], config, data);
    case 'use pmh as risk':
      return data["Day 1 PM High"];
    case 'risk from 9:45 close':
      return calculateRisk(data["Day 1 15Min High"], config, data)
    case 'risk from 10am High':
      return calculateRisk(data["Day 1 30Min High"], config, data);
    case 'risk from 10:30am High':
      return calculateRisk(data["Day 1 60Min High"], config, data);
    case 'use 10:30am high as risk':
      return addWiggleRoom(data["Day 1 60Min High"], config);
    case 'use 10am high as risk':
      return addWiggleRoom(data["Day 1 30Min High"], config);
    case 'use 11am high as risk':
      return addWiggleRoom(data["Day 1 90Min High"], config);
    case 'use 11:30am high as risk':
        return addWiggleRoom(data["Day 1 120Min High"], config);
    case 'use 9:45am high as risk':
      return addWiggleRoom(data["Day 1 15Min High"], config);
    case 'use prev day close as risk':
      return addWiggleRoom(data["Day -1 Close"], config);
  }
}

export function addWiggleRoom(price: number, config: ISimulationEngineConfig): number {
  const wiggleRoom = config.wiggle_room;
  return(price + (price * (wiggleRoom/100)));
}

export function getRiskLevelWithWiggleRoom(config: ISimulationEngineConfig, data: IDataGapperUploadExtended): number {
  const wiggleRoom = config.wiggle_room;
  const riskLevel = getMaxLossRiskLevel(config, data);
  return(riskLevel + (riskLevel * (wiggleRoom/100)));
}
