import { GraphRenderer } from './core/graph-renderer.js';
import { GraphInteractions } from './core/graph-interactions.js';
import { MarkerDrag } from './features/marker-drag.js';
import { AnimationController } from './core/animation-controller.js';
import { DijkstraApi } from './services/dijkstra-api.js';
import { SoundEffects } from './services/sound-effects.js';
import { UIFeedback } from './features/ui-feedback.js';

document.addEventListener('DOMContentLoaded', () => {
  // Instanciar servicios globales
  const sounds = new SoundEffects();
  const ui = new UIFeedback();

  const renderer = new GraphRenderer('graph-canvas');
  const interactions = new GraphInteractions(renderer, ui, sounds);
  const markerDrag = new MarkerDrag(renderer);
  const animController = new AnimationController(renderer, sounds);

  const btnExecute = document.getElementById('btn-execute');

  btnExecute?.addEventListener('click', async () => {
    const startNode = renderer.getStartNodeId();
    const targetNode = renderer.getTargetNodeId();

    if (!startNode || !targetNode) {
      ui.showToast('Define los nodos de Inicio y Meta arrastrando las insignias del panel.', 'error');
      return;
    }

    const requestData = {
      nodes: renderer.getNodes().map((n) => ({ id: n.id, label: n.label })),
      edges: renderer.getEdges().map((e) => ({ from: e.from, to: e.to, weight: e.weight })),
      startNode,
      targetNode,
    };

    try {
      btnExecute.textContent = 'Calculando...';
      const response = await DijkstraApi.solve(requestData);

      ui.showToast('Ruta calculada con éxito', 'success');
      animController.loadExecution(response);
      animController.play();
    } catch (error: any) {
      ui.showToast(error.message || 'Error al conectar con el servidor', 'error');
    } finally {
      btnExecute.textContent = 'Calcular Ruta';
    }
  });
});