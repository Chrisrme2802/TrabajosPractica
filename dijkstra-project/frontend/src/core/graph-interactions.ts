import * as d3 from 'd3';
import type { GraphRenderer } from './graph-renderer.js';
import type { GraphNode, GraphEdge } from '../types/dijkstra-types.js';
import type { SoundEffects } from '../services/sound-effects.js';
import { UIFeedback } from '../features/ui-feedback.js';

export class GraphInteractions {
  private renderer: GraphRenderer;
  private ui: UIFeedback;
  private sounds?: SoundEffects;
  private trashElement: HTMLElement | null;
  private tempLine: d3.Selection<SVGLineElement, unknown, HTMLElement, any> | null = null;
  private sourceNode: GraphNode | null = null;

  constructor(renderer: GraphRenderer, ui: UIFeedback, sounds?: SoundEffects) {
    this.renderer = renderer;
    this.ui = ui;
    this.sounds = sounds;
    this.trashElement = document.getElementById('trash-zone');
    this.initCanvasEvents();
    this.initNodeEvents();
  }

  private initCanvasEvents(): void {
    const svg = this.renderer.getSvg();

    svg.on('dblclick', async (event: MouseEvent) => {
      event.preventDefault();
      if (event.shiftKey) return;
      const [x, y] = d3.pointer(event);
      await this.promptAddNode(x, y);
    });
  }

  private async promptAddNode(x: number, y: number): Promise<void> {
    const nodes = this.renderer.getNodes();
    const defaultName = `N${nodes.length + 1}`;

    const inputName = await this.ui.showInput({
      title: 'Crear Nuevo Nodo',
      subtitle: 'Ingresa el nombre o identificador.',
      defaultValue: defaultName,
      placeholder: 'Ej. A, B, C...',
      validate: (val) => {
        if (!val) return 'El identificador no puede estar vacío.';
        const nameUpper = val.toUpperCase();
        if (nodes.some((n) => n.id === nameUpper)) {
          return `Ya existe un nodo con el nombre "${nameUpper}".`;
        }
        return null;
      },
    });

    if (!inputName) return;

    const name = inputName.trim().toUpperCase();
    this.renderer.addNode({ id: name, x, y, label: name });
    this.sounds?.playPop(); // Sonido al crear nodo
    this.initNodeEvents();
  }

  private isOverTrash(clientX: number, clientY: number): boolean {
    if (!this.trashElement) return false;
    const rect = this.trashElement.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  private findNodeAtPosition(x: number, y: number): GraphNode | undefined {
    const radius = this.renderer.nodeRadius;
    return this.renderer.getNodes().find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    });
  }

  private async promptEdgeWeight(from: string, to: string): Promise<void> {
    const inputWeight = await this.ui.showInput({
      title: 'Peso de la Arista',
      subtitle: `Asigna la distancia para (${from} ➔ ${to}).`,
      defaultValue: '1',
      placeholder: 'Ej. 5, 10...',
      validate: (val) => {
        const num = parseFloat(val);
        if (isNaN(num) || num <= 0) return 'Ingresa un número mayor a 0.';
        return null;
      },
    });

    if (!inputWeight) return;

    const weight = parseFloat(inputWeight);
    const edges = this.renderer.getEdges();
    const existingEdge = edges.find((e) => e.from === from && e.to === to);

    if (existingEdge) {
      existingEdge.weight = weight;
    } else {
      const id = `${from}-${to}`;
      edges.push({ id, from, to, weight });
    }

    this.sounds?.playPop(); // Sonido al crear/actualizar arista
    this.renderer.render();
  }

  public initNodeEvents(): void {
    const svg = this.renderer.getSvg();
    const nodeGroups = svg.selectAll<SVGGElement, GraphNode>('g.node-group');

    nodeGroups.on('.drag', null);

    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .filter((event: MouseEvent) => event.button === 0)
      .on('start', (event, d) => {
        if (event.sourceEvent.shiftKey) {
          this.sourceNode = d;

          const mainGroup = svg.select<SVGGElement>('g.main-group');
          const edgesLayer = mainGroup.select<SVGGElement>('g.edges-layer');

          this.tempLine = edgesLayer
            .append('line')
            .attr('class', 'temp-edge-line')
            .attr('marker-end', 'url(#temp-arrowhead)')
            .attr('x1', d.x)
            .attr('y1', d.y)
            .attr('x2', d.x)
            .attr('y2', d.y);
        } else {
          this.trashElement?.classList.add('trash-visible');
        }
      })
      .on('drag', (event, d) => {
        if (event.sourceEvent.shiftKey || this.tempLine) {
          if (!this.tempLine) return;
          const [x, y] = d3.pointer(event, svg.node());
          this.tempLine.attr('x2', x).attr('y2', y);
        } else {
          d.x = event.x;
          d.y = event.y;
          this.renderer.render();

          const isHovering = this.isOverTrash(event.sourceEvent.clientX, event.sourceEvent.clientY);
          if (isHovering) {
            this.trashElement?.classList.add('trash-active');
          } else {
            this.trashElement?.classList.remove('trash-active');
          }
        }
      })
      .on('end', async (event, d) => {
        if (this.tempLine) {
          this.tempLine.remove();
          this.tempLine = null;

          if (this.sourceNode) {
            const [x, y] = d3.pointer(event, svg.node());
            const targetNode = this.findNodeAtPosition(x, y);

            if (targetNode && targetNode.id !== this.sourceNode.id) {
              await this.promptEdgeWeight(this.sourceNode.id, targetNode.id);
            }
          }
          this.sourceNode = null;
        } else {
          this.trashElement?.classList.remove('trash-visible', 'trash-active');

          const droppedInTrash = this.isOverTrash(
            event.sourceEvent.clientX,
            event.sourceEvent.clientY
          );

          if (droppedInTrash) {
            this.renderer.removeNode(d.id);
            this.sounds?.playDelete(); // Sonido al tirar a la papelera
            this.ui.showToast(`Nodo "${d.id}" eliminado`, 'info');
          }
        }
      });

    nodeGroups.call(dragBehavior);

    nodeGroups.on('contextmenu', async (event: MouseEvent, d) => {
      event.preventDefault();
      const confirmed = await this.ui.showConfirm({
        title: 'Eliminar Nodo',
        subtitle: `¿Estás seguro de que deseas borrar el nodo "${d.id}"?`,
      });

      if (confirmed) {
        this.renderer.removeNode(d.id);
        this.sounds?.playDelete(); // Sonido al borrar
        this.ui.showToast(`Nodo "${d.id}" eliminado`, 'info');
      }
    });
  }
}