// Estructura de nodos y aristas para D3 (con coordenadas visuales para el lienzo)
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

//Las mismas del backend
export interface Node {
  id: string;
  label?: string;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface DijkstraRequest {
  nodes: Node[];
  edges: Edge[];
  startNode: string;
  targetNode: string;
}

export interface Step {
  stepNumber: number;
  currentNode: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: string[];
  description: string;
}

export interface DijkstraResponse {
  path: string[];
  totalDistance: number;
  steps: Step[];
}