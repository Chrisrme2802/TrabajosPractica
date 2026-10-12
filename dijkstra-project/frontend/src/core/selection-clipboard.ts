import type { GraphRenderer } from './graph-renderer.js';
import type { GraphInteractions } from './graph-interactions.js';
import type { GraphNode, GraphEdge } from '../types/dijkstra-types.js';
import type { UIFeedback } from '../features/ui-feedback.js';
import type { SoundEffects } from '../services/sound-effects.js';

export class SelectionClipboard {
  private renderer: GraphRenderer;
  private interactions: GraphInteractions;
  private ui: UIFeedback;
  private sounds?: SoundEffects;

  private copiedNodes: GraphNode[] = [];
  private copiedEdges: GraphEdge[] = [];

  constructor(
    renderer: GraphRenderer,
    interactions: GraphInteractions,
    ui: UIFeedback,
    sounds?: SoundEffects
  ) {
    this.renderer = renderer;
    this.interactions = interactions;
    this.ui = ui;
    this.sounds = sounds;
    this.initKeyboardShortcuts();
  }

  private initKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      const isControl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isControl && key === 'c') {
        e.preventDefault();
        this.copySelected();
      } else if (isControl && key === 'v') {
        e.preventDefault();
        this.pasteCopied();
      }
    });
  }

  public copySelected(): void {
    const allNodes = this.renderer.getNodes();
    const allEdges = this.renderer.getEdges();

    const selectedNodes = allNodes.filter((n) => n.selected);

    if (selectedNodes.length === 0) {
      this.ui.showToast('Selecciona nodos con la caja de arrastre para copiar', 'info');
      return;
    }

    const selectedIds = new Set(selectedNodes.map((n) => n.id));

    this.copiedNodes = selectedNodes.map((n) => ({
      id: n.id,
      label: n.label,
      x: n.x,
      y: n.y,
    }));

    this.copiedEdges = allEdges
      .filter((e) => selectedIds.has(e.from) && selectedIds.has(e.to))
      .map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        weight: e.weight,
      }));

    this.sounds?.playPop();
    this.ui.showToast(`Copiados ${selectedNodes.length} nodos`, 'success');
  }

  public pasteCopied(): void {
    if (this.copiedNodes.length === 0) {
      this.ui.showToast('El portapapeles está vacío. Copia algo primero.', 'info');
      return;
    }

    const currentNodes = this.renderer.getNodes();
    const currentEdges = this.renderer.getEdges();

    const idMap = new Map<string, string>();
    currentNodes.forEach((n) => (n.selected = false));

    const OFFSET = 40;

    // 1. Crear copias de los nodos
    this.copiedNodes.forEach((oldNode) => {
      const newId = this.generateUniqueId(oldNode.id, currentNodes);
      idMap.set(oldNode.id, newId);

      const newNode: GraphNode = {
        id: newId,
        label: newId,
        x: oldNode.x + OFFSET,
        y: oldNode.y + OFFSET,
        selected: true,
      };

      currentNodes.push(newNode);
    });

    // 2. Crear copias de las aristas internas
    this.copiedEdges.forEach((oldEdge) => {
      const newFrom = idMap.get(oldEdge.from);
      const newTo = idMap.get(oldEdge.to);

      if (newFrom && newTo) {
        currentEdges.push({
          id: `${newFrom}-${newTo}`,
          from: newFrom,
          to: newTo,
          weight: oldEdge.weight,
        });
      }
    });

    this.sounds?.playPop();

    // Redibujar el SVG
    this.renderer.render();

    // VINCULAR EVENTOS D3 EN LOS NUEVOS NODOS CREADOS
    this.interactions.rebindNodeEvents();

    this.ui.showToast(`Pegados ${this.copiedNodes.length} nodos`, 'success');
  }

  private generateUniqueId(baseId: string, existingNodes: GraphNode[]): string {
    const cleanBase = baseId.replace(/_\d+$/, '');
    let counter = 1;
    let candidate = `${cleanBase}_${counter}`;

    const existingIds = new Set(existingNodes.map((n) => n.id));

    while (existingIds.has(candidate)) {
      counter++;
      candidate = `${cleanBase}_${counter}`;
    }

    return candidate;
  }
}