export type TransportMethod = 'northwest' | 'minimum-cost' | 'vogel';

export interface TransportInput {
  sources: string[];
  destinations: string[];
  costs: number[][];
  supply: number[];
  demand: number[];
  method: TransportMethod;
}

export interface StepCell {
  row: number;
  col: number;
}

export interface TransportStep {
  stepNumber: number;
  description: string;
  selectedCell?: StepCell;
  allocatedAmount?: number;
  currentAllocations: number[][];
  remainingSupply: number[];
  remainingDemand: number[];
  //Aproximación de Vogel
  rowPenalties?: (number | null)[];
  colPenalties?: (number | null)[];
}

export interface TransportResult {
  totalCost: number;
  allocations: number[][];
  steps: TransportStep[];
}