import type { DijkstraRequest, DijkstraResponse, Step } from '../types/dijkstra-types.js';

export class DijkstraService {
  public static solve(data: DijkstraRequest): DijkstraResponse {
    const { nodes, edges, startNode, targetNode } = data;

    // 1. Construir lista de adyacencia
    const adjacencyList: Record<string, { node: string; weight: number }[]> = {};
    
    nodes.forEach(node => {
      adjacencyList[node.id] = [];
    });

    edges.forEach(edge => {
      adjacencyList[edge.from]?.push({ node: edge.to, weight: edge.weight });
      // Si el grafo fuera NO dirigido, agregarías también la arista inversa:
      // adjacencyList[edge.to]?.push({ node: edge.from, weight: edge.weight });
    });

    // 2. Inicializar HashMaps y conjuntos
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();
    const visited: string[] = [];
    const steps: Step[] = [];

    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    // La distancia al nodo origen siempre es 0
    distances[startNode] = 0;
    let stepCount = 1;

    // 3. Bucle principal de Dijkstra
    while (unvisited.size > 0) {
      // Buscar el nodo no visitado con la menor distancia acumulada
      let current: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        const dist = distances[node] ?? Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          current = node;
        }
      }

      // Si no hay nodos alcanzables restantes, rompemos
      if (current === null || minDistance === Infinity) break;

      // Marcar el nodo como permanente/visitado
      unvisited.delete(current);
      visited.push(current);

      // Guardar el estado actual en la bitácora de pasos (para el frontend)
      steps.push({
        stepNumber: stepCount++,
        currentNode: current,
        distances: { ...distances },
        previous: { ...previous },
        visited: [...visited],
        description: `Se selecciona el nodo '${current}' con distancia acumulada de ${minDistance}.`
      });

      // Si alcanzamos el objetivo, podemos terminar la búsqueda temprana
      if (current === targetNode) break;

      // Evaluar los vecinos del nodo actual
      const neighbors = adjacencyList[current] || [];
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.node)) continue; // Ignorar nodos que ya son permanentes

        const currentDist = distances[current] ?? 0;
        const newDist = currentDist + neighbor.weight;
        const neighborDist = distances[neighbor.node] ?? Infinity;

        // Actualizar si encontramos un camino más corto
        if (newDist < neighborDist) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = current;
        }
      }
    }

    // 4. Reconstruir el camino óptimo hacia atrás (Backtracking)
    const path: string[] = [];
    let curr: string | null = targetNode;

    if (distances[targetNode] !== Infinity && distances[targetNode] !== undefined) {
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr] ?? null;
      }
    }

    return {
      path,
      totalDistance: distances[targetNode] ?? Infinity,
      steps
    };
  }
}