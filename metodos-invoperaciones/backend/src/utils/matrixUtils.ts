//Crea una copia profunda de un arreglo 2D (matriz)
export function cloneMatrix<T>(matrix: T[][]): T[][] {
  return matrix.map(row => [...row]);
}

//Calcula la penalización de Vogel para un arreglo de costos activos.
//Retorna la diferencia entre los dos costos más bajos.
export function calculatePenalty(costs: number[]): number | null {
  if (costs.length === 0) return null;
  if (costs.length === 1) return costs[0];

  const sorted = [...costs].sort((a, b) => a - b);
  return sorted[1] - sorted[0];
}

//Calcula el costo total Z = sum(costo_ij * asignacion_ij)
export function calculateTotalCost(costs: number[][], allocations: number[][]): number {
  let total = 0;
  for (let r = 0; r < costs.length; r++) {
    for (let c = 0; c < costs[0].length; c++) {
      total += costs[r][c] * allocations[r][c];
    }
  }
  return total;
}