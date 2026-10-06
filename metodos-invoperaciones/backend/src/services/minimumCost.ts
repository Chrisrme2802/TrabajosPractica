import { TransportInput, TransportResult } from '../types/transport';
import { solveGeneric } from '../utils/transportCore.js';

export function solveMinimumCost(input: TransportInput): TransportResult {
  return solveGeneric(input, (costs, supply, demand, disabledRows, disabledCols) => {
    let minCost = Infinity;
    let minCell = null;

    for (let r = 0; r < costs.length; r++) {
      if (disabledRows[r]) continue;
      for (let c = 0; c < costs[0].length; c++) {
        if (disabledCols[c]) continue;
        if (costs[r][c] < minCost) {
          minCost = costs[r][c];
          minCell = { row: r, col: c };
        }
      }
    }

    if (!minCell) return { cell: null, description: '' };

    return {
      cell: minCell,
      description: `Menor costo ($${minCost}) en (${input.sources[minCell.row]}, ${input.destinations[minCell.col]}).`
    };
  });
}