import { TransportInput, TransportResult, TransportStep } from '../types/transport.js';

export function solveHungarian(input: TransportInput): TransportResult {
  const steps: TransportStep[] = [];
  let stepCounter = 1;

  const N = input.costs.length;
  let matrix = input.costs.map(row => [...row]);

  // Tabla 1: Matriz Inicial
  steps.push({
    stepNumber: stepCounter++,
    description: `Tabla 1: Matriz inicial de asignación ${N}x${N}.`,
    currentAllocations: matrix.map(row => [...row]),
    remainingSupply: new Array(N).fill(1),
    remainingDemand: new Array(N).fill(1)
  });

  // Tabla 2: Reducción de Filas
  for (let r = 0; r < N; r++) {
    const minRow = Math.min(...matrix[r]);
    for (let c = 0; c < N; c++) {
      matrix[r][c] -= minRow;
    }
  }

  steps.push({
    stepNumber: stepCounter++,
    description: 'Tabla 2: Reducción de Filas — Se restó el elemento mínimo de cada fila.',
    currentAllocations: matrix.map(row => [...row]),
    remainingSupply: new Array(N).fill(1),
    remainingDemand: new Array(N).fill(1)
  });

  // Tabla 3: Reducción de Columnas
  for (let c = 0; c < N; c++) {
    let minCol = Infinity;
    for (let r = 0; r < N; r++) {
      if (matrix[r][c] < minCol) minCol = matrix[r][c];
    }
    for (let r = 0; r < N; r++) {
      matrix[r][c] -= minCol;
    }
  }

  steps.push({
    stepNumber: stepCounter++,
    description: 'Tabla 3: Reducción de Columnas — Se restó el elemento mínimo de cada columna.',
    currentAllocations: matrix.map(row => [...row]),
    remainingSupply: new Array(N).fill(1),
    remainingDemand: new Array(N).fill(1)
  });

  // Tabla 4: Cubrimiento por líneas y prueba de optimalidad
  let assignment: number[] = new Array(N).fill(-1);

  while (true) {
    const lines = computeExactMinLines(matrix, N);
    const lineCount = lines.coveredRows.filter(Boolean).length + lines.coveredCols.filter(Boolean).length;

    if (lineCount >= N) {
      assignment = lines.assignment;
      steps.push({
        stepNumber: stepCounter++,
        description: `Tabla 4: Cubrimiento Óptimo Alcanzado — Se trazaron ${lineCount} líneas (igual a N = ${N}). ¡Se realiza la asignación óptima sobre ceros!`,
        currentAllocations: matrix.map(row => [...row]),
        remainingSupply: new Array(N).fill(1),
        remainingDemand: new Array(N).fill(1),
        coveredRows: lines.coveredRows,
        coveredCols: lines.coveredCols
      });
      break;
    }

    // Elemento no cubierto mínimo (k)
    let k = Infinity;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!lines.coveredRows[r] && !lines.coveredCols[c]) {
          if (matrix[r][c] < k) k = matrix[r][c];
        }
      }
    }

    steps.push({
      stepNumber: stepCounter++,
      description: `Tabla 4: Prueba de Optimalidad — Se trazaron ${lineCount} líneas (menor que N = ${N}). Elemento no cubierto menor k = ${k}. Se restará k a celdas no cubiertas y se sumará en las intersecciones.`,
      currentAllocations: matrix.map(row => [...row]),
      remainingSupply: new Array(N).fill(1),
      remainingDemand: new Array(N).fill(1),
      coveredRows: lines.coveredRows,
      coveredCols: lines.coveredCols
    });

    // Modificar la matriz según las líneas
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!lines.coveredRows[r] && !lines.coveredCols[c]) {
          matrix[r][c] -= k;
        } else if (lines.coveredRows[r] && lines.coveredCols[c]) {
          matrix[r][c] += k;
        }
      }
    }
  }

  // Asignación Final y Costo Total Z
  const finalAllocations: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  let totalCost = 0;

  for (let r = 0; r < N; r++) {
    const c = assignment[r];
    if (c !== -1) {
      finalAllocations[r][c] = 1;
      totalCost += input.costs[r][c];
    }
  }

  steps.push({
    stepNumber: stepCounter++,
    description: `Asignación Final de Costo Mínimo Completada. Costo Total Z = $${totalCost}`,
    currentAllocations: finalAllocations.map(row => [...row]),
    remainingSupply: new Array(N).fill(0),
    remainingDemand: new Array(N).fill(0)
  });

  return {
    totalCost,
    allocations: finalAllocations,
    steps
  };
}

// Algoritmo de cobertura de líneas mínimas con máximo emparejamiento (König)
function computeExactMinLines(matrix: number[][], N: number) {
  const matchR = new Array(N).fill(-1);
  const matchC = new Array(N).fill(-1);

  function dfs(u: number, vis: boolean[]): boolean {
    for (let v = 0; v < N; v++) {
      if (matrix[u][v] === 0 && !vis[v]) {
        vis[v] = true;
        if (matchC[v] < 0 || dfs(matchC[v], vis)) {
          matchC[v] = u;
          matchR[u] = v;
          return true;
        }
      }
    }
    return false;
  }

  for (let i = 0; i < N; i++) {
    const vis = new Array(N).fill(false);
    dfs(i, vis);
  }

  const visitedRows = new Array(N).fill(false);
  const visitedCols = new Array(N).fill(false);

  function mark(r: number) {
    visitedRows[r] = true;
    for (let c = 0; c < N; c++) {
      if (matrix[r][c] === 0 && !visitedCols[c]) {
        visitedCols[c] = true;
        if (matchC[c] !== -1 && !visitedRows[matchC[c]]) {
          mark(matchC[c]);
        }
      }
    }
  }

  for (let r = 0; r < N; r++) {
    if (matchR[r] === -1) {
      mark(r);
    }
  }

  const coveredRows = new Array(N).fill(false);
  const coveredCols = new Array(N).fill(false);

  for (let r = 0; r < N; r++) {
    if (!visitedRows[r]) coveredRows[r] = true;
  }
  for (let c = 0; c < N; c++) {
    if (visitedCols[c]) coveredCols[c] = true;
  }

  return { coveredRows, coveredCols, assignment: matchR };
}