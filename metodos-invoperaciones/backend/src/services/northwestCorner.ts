import { TransportInput, TransportResult } from '../types/transport.js';
import { solveGeneric } from '../utils/transportCore.js';

export function solveNorthwestCorner(input: TransportInput): TransportResult {
  return solveGeneric(input, (costs, supply, demand, disabledRows, disabledCols, pointer) => {
    while (pointer.r < costs.length && disabledRows[pointer.r]) pointer.r++;
    while (pointer.c < costs[0].length && disabledCols[pointer.c]) pointer.c++;

    if (pointer.r >= costs.length || pointer.c >= costs[0].length) {
      return { cell: null, description: '' };
    }

    return {
      cell: { row: pointer.r, col: pointer.c },
      description: `Esquina Noroeste: Asignación en (${input.sources[pointer.r]}, ${input.destinations[pointer.c]}).`
    };
  });
}