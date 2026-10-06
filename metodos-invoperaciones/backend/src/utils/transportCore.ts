import { TransportInput, TransportResult, TransportStep, StepCell } from '../types/transport.js';
import { cloneMatrix, calculateTotalCost } from './matrixUtils.js';

// Firma de la función que decide qué celda elegir en cada iteración
type CellSelector = (
  costs: number[][],
  supply: number[],
  demand: number[],
  disabledRows: boolean[],
  disabledCols: boolean[],
  pointer: { r: number; c: number } // Para esquina noroeste
) => {
  cell: StepCell | null;
  description: string;
  rowPenalties?: (number | null)[];
  colPenalties?: (number | null)[];
};

/**
 * Motor Genérico para Resolver Problemas de Transporte
 */
export function solveGeneric(input: TransportInput, selectNextCell: CellSelector): TransportResult {
  const numRows = input.costs.length;
  const numCols = input.costs[0].length;

  const supply = [...input.supply];
  const demand = [...input.demand];
  const allocations: number[][] = Array.from({ length: numRows }, () => Array(numCols).fill(0));
  const steps: TransportStep[] = [];

  const disabledRows = new Array(numRows).fill(false);
  const disabledCols = new Array(numCols).fill(false);

  let stepNumber = 1;
  const pointer = { r: 0, c: 0 }; // Puntero interno para Esquina Noroeste

  while (disabledRows.includes(false) && disabledCols.includes(false)) {
    // Se ejecuta la estrategia específica para encontrar la celda objetivo
    const selection = selectNextCell(
      input.costs,
      supply,
      demand,
      disabledRows,
      disabledCols,
      pointer
    );

    if (!selection.cell) break; // No hay más celdas disponibles

    const { row, col } = selection.cell;
    const allocated = Math.min(supply[row], demand[col]);

    // Asignación y actualización de estados comunes
    allocations[row][col] = allocated;
    supply[row] -= allocated;
    demand[col] -= allocated;

    // Registro del paso unificado
    steps.push({
      stepNumber: stepNumber++,
      description: selection.description,
      selectedCell: { row, col },
      allocatedAmount: allocated,
      currentAllocations: cloneMatrix(allocations),
      remainingSupply: [...supply],
      remainingDemand: [...demand],
      rowPenalties: selection.rowPenalties,
      colPenalties: selection.colPenalties
    });

    // Criterio unificado de desactivación
    if (supply[row] === 0) disabledRows[row] = true;
    if (demand[col] === 0) disabledCols[col] = true;
  }

  return {
    totalCost: calculateTotalCost(input.costs, allocations),
    allocations,
    steps
  };
}