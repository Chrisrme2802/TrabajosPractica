import { TransportInput, TransportResult } from '../types/transport.js';
import { solveGeneric } from '../utils/transportCore.js';
import { calculatePenalty } from '../utils/matrixUtils.js';

export function solveVogel(input: TransportInput): TransportResult {
  return solveGeneric(input, (costs, supply, demand, disabledRows, disabledCols) => {
    // 1. Calcular penalizaciones
    const rowPenalties = disabledRows.map((disabled, r) => 
      disabled ? null : calculatePenalty(costs[r].filter((_, c) => !disabledCols[c]))
    );
    const colPenalties = disabledCols.map((disabled, c) => 
      disabled ? null : calculatePenalty(costs.map(row => row[c]).filter((_, r) => !disabledRows[r]))
    );

    // 2. Encontrar la mayor penalización
    let maxPenalty = -1;
    let targetRow = -1;
    let targetCol = -1;
    let isRow = true;

    rowPenalties.forEach((p, r) => {
      if (p !== null && p > maxPenalty) { maxPenalty = p; targetRow = r; isRow = true; }
    });
    colPenalties.forEach((p, c) => {
      if (p !== null && p > maxPenalty) { maxPenalty = p; targetCol = c; isRow = false; }
    });

    if (maxPenalty === -1) return { cell: null, description: '' };

    // 3. Obtener celda de menor costo en esa fila/columna
    if (isRow) {
      let minCost = Infinity;
      costs[targetRow].forEach((cost, c) => {
        if (!disabledCols[c] && cost < minCost) { minCost = cost; targetCol = c; }
      });
    } else {
      let minCost = Infinity;
      costs.forEach((row, r) => {
        if (!disabledRows[r] && row[targetCol] < minCost) { minCost = row[targetCol]; targetRow = r; }
      });
    }

    return {
      cell: { row: targetRow, col: targetCol },
      description: `Mayor penalización (${maxPenalty}) en ${isRow ? 'Fila ' + input.sources[targetRow] : 'Columna ' + input.destinations[targetCol]}.`,
      rowPenalties,
      colPenalties
    };
  });
}