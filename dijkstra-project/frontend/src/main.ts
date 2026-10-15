import { GraphRenderer } from './core/graph-renderer.js';
import { GraphInteractions } from './core/graph-interactions.js';
import { MarkerDrag } from './features/marker-drag.js';
import { AnimationController } from './core/animation-controller.js';
import { DijkstraApi } from './services/dijkstra-api.js';
import { SoundEffects } from './services/sound-effects.js';
import { UIFeedback } from './features/ui-feedback.js';
import { SelectionClipboard } from './core/selection-clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
  // global
  const sounds = new SoundEffects();
  const ui = new UIFeedback();

  // visual
  const renderer = new GraphRenderer('graph-canvas');
  const animController = new AnimationController(renderer, sounds);

  // autonomos sin asignar a variables
  const interactions = new GraphInteractions(renderer, ui, sounds);
  new SelectionClipboard(renderer, interactions, ui, sounds);
  new GraphInteractions(renderer, ui, sounds);
  new MarkerDrag(renderer);
  new SelectionClipboard(renderer, interactions, ui, sounds); // Aquí necesitas pasar 'interactions', así que ajustaremos esto:  

  const btnExecute = document.getElementById('btn-execute') as HTMLButtonElement | null;

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
      // bloquear raton para evitar multiples clicks a la api
      btnExecute.disabled = true;
      btnExecute.textContent = 'Calculando...';
      btnExecute.classList.add('opacity-50', 'cursor-not-allowed');

      const response = await DijkstraApi.solve(requestData);

      ui.showToast('Ruta calculada con éxito', 'success');
      animController.loadExecution(response);
      animController.play();
      
    } catch (error: any) {
      ui.showToast(error.message || 'Error al conectar con el servidor', 'error');
    } finally {
      btnExecute.disabled = false;
      btnExecute.textContent = 'Calcular Ruta';
      btnExecute.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });
});