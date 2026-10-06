import { TableManager } from './table/TableManager.js';
import { StepVisualizer } from './stepVisualizer.js';
import { solveProblem } from './api.js';
import type { TransportMethod } from './types/transport.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableManager = new TableManager('table-container');
  const visualizer = new StepVisualizer('visualizer-container');

  const methodSelect = document.getElementById('select-method') as HTMLSelectElement;
  const solveBtn = document.getElementById('btn-solve') as HTMLButtonElement;
  const errorAlert = document.getElementById('error-alert') as HTMLElement;

  solveBtn?.addEventListener('click', async () => {
    errorAlert.classList.add('hidden');
    errorAlert.textContent = '';

    const selectedMethod = (methodSelect?.value || 'vogel') as TransportMethod;
    const payload = tableManager.getData(selectedMethod);

    // Validación básica antes de enviar
    const { balanced } = tableManager.state.isBalanced();
    if (!balanced) {
      errorAlert.textContent = 'La suma total de la Oferta debe ser igual a la suma total de la Demanda.';
      errorAlert.classList.remove('hidden');
      return;
    }

    try {
      solveBtn.disabled = true;
      solveBtn.textContent = 'Calculando...';

      const solution = await solveProblem(payload);

      visualizer.setSolution(
        solution,
        payload.sources,
        payload.destinations,
        payload.costs
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el backend.';
      errorAlert.textContent = message;
      errorAlert.classList.remove('hidden');
    } finally {
      solveBtn.disabled = false;
      solveBtn.textContent = '🚀 Resolver Problema';
    }
  });
});