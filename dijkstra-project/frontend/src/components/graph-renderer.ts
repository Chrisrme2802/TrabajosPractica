import * as d3 from 'd3';
import type { GraphNode, GraphEdge } from '../types/dijkstra-types.js';

export class GraphRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  
  private startNodeId: string | null = null;
  private targetNodeId: string | null = null;

  private nodeRadius = 24;
  private nodeCounter = 0;

  constructor(svgId: string) {
    this.svg = d3.select<SVGSVGElement, unknown>(`#${svgId}`);
    this.initEvents();
  }

  private initEvents(): void {
    // Evento de doble clic sobre el SVG para crear un nuevo nodo
    this.svg.on('dblclick', (event: MouseEvent) => {
      // Prevenir el comportamiento por defecto de zoom al hacer doble clic
      event.preventDefault();
      
      const [x, y] = d3.pointer(event);
      this.addNode(x, y);
    });
  }

  // Genera nombres de nodos en orden alfabético: A, B, C... Z, AA, AB...
  private generateNodeLabel(index: number): string {
    let label = '';
    let i = index;
    while (i >= 0) {
      label = String.fromCharCode((i % 26) + 65) + label;
      i = Math.floor(i / 26) - 1;
    }
    return label;
  }

  public addNode(x: number, y: number): void {
    const id = this.generateNodeLabel(this.nodeCounter++);
    const newNode: GraphNode = { id, x, y, label: id };
    
    this.nodes.push(newNode);
    this.render();
  }

  public setStartNode(id: string): void {
    this.startNodeId = id;
    this.render();
  }

  public setTargetNode(id: string): void {
    this.targetNodeId = id;
    this.render();
  }

  public getNodes(): GraphNode[] {
    return this.nodes;
  }

  public getEdges(): GraphEdge[] {
    return this.edges;
  }

  // Dibuja y actualiza los elementos dentro del contenedor SVG
  public render(): void {
    // Contenedor principal de capas para mantener las aristas debajo de los nodos
    let mainGroup = this.svg.select<SVGGElement>('g.main-group');
    if (mainGroup.empty()) {
      mainGroup = this.svg.append('g').attr('class', 'main-group');
      mainGroup.append('g').attr('class', 'edges-layer');
      mainGroup.append('g').attr('class', 'nodes-layer');
    }

    const nodesLayer = mainGroup.select<SVGGElement>('g.nodes-layer');

    // Mapeo de Nodos con D3 (Data Join)
    const nodeSelection = nodesLayer
      .selectAll<SVGGElement, GraphNode>('g.node-group')
      .data(this.nodes, (d) => d.id);

    // Salida (Remove)
    nodeSelection.exit().remove();

    // Entrada (Enter)
    const nodeEnter = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    // Circulo base del nodo
    nodeEnter
      .append('circle')
      .attr('r', this.nodeRadius)
      .attr('class', 'fill-slate-900 stroke-slate-600 stroke-2 transition-colors');

    // Texto del identificador del nodo
    nodeEnter
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'fill-slate-200 text-xs font-bold pointer-events-none')
      .text((d) => d.id);

    // Actualización de estados (Merge)
    const nodeUpdate = nodeEnter.merge(nodeSelection);

    nodeUpdate.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    // Aplicar estilos si el nodo es Inicio o Meta
    nodeUpdate.select('circle').attr('class', (d) => {
      let classes = 'fill-slate-900 stroke-2 transition-colors ';
      if (d.id === this.startNodeId) {
        classes += 'stroke-amber-400 fill-amber-500/10 node-start';
      } else if (d.id === this.targetNodeId) {
        classes += 'stroke-emerald-400 fill-emerald-500/10 node-target';
      } else {
        classes += 'stroke-slate-600 hover:stroke-indigo-400';
      }
      return classes;
    });
  }
}