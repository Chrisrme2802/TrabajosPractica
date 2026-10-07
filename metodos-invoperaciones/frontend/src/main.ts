import { TableManager } from './table/TableManager.js';
import { StepVisualizer } from './stepVisualizer.js';
import { solveProblem } from './api.js';
import type { TransportMethod } from './types/transport.js';
import { sfx } from './sfx.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableManager = new TableManager('table-container');
  const visualizer = new StepVisualizer('visualizer-container');

  const methodSelect = document.getElementById('select-method') as HTMLSelectElement;
  const solveBtn = document.getElementById('btn-solve') as HTMLButtonElement;
  const errorAlert = document.getElementById('error-alert') as HTMLElement;

  methodSelect?.addEventListener('change', () => {
    sfx.playClick();
    const selectedMethod = (methodSelect.value || 'vogel') as TransportMethod;
    tableManager.setMethod(selectedMethod);
  });

  solveBtn?.addEventListener('click', async () => {
    sfx.playClick();
    errorAlert.classList.add('hidden');
    errorAlert.textContent = '';

    const selectedMethod = (methodSelect?.value || 'vogel') as TransportMethod;
    const payload = tableManager.getData(selectedMethod);

    const numRows = payload.sources.length;
    const numCols = payload.destinations.length;

    // Validaciones de entrada por método
    if (selectedMethod === 'hungarian') {
      if (numRows !== numCols) {
        sfx.playError();
        errorAlert.textContent = `El Método Húngaro requiere una matriz cuadrada (N x N). Actualmente tienes ${numRows} filas y ${numCols} columnas. Agrega o elimina filas/columnas para igualarlas.`;
        errorAlert.classList.remove('hidden');
        return;
      }
    } else {
      const { balanced } = tableManager.state.isBalanced();
      if (!balanced) {
        sfx.playError();
        errorAlert.textContent = 'La suma total de la Oferta debe ser igual a la suma total de la Demanda.';
        errorAlert.classList.remove('hidden');
        return;
      }
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
      sfx.playError();
      const message = err instanceof Error ? err.message : 'Error al conectar con el backend.';
      errorAlert.textContent = message;
      errorAlert.classList.remove('hidden');
    } finally {
      solveBtn.disabled = false;
      solveBtn.textContent = 'Resolver Problema';
    }
  });

  // Modal de Créditos
  const btnCredits = document.getElementById('btn-credits') as HTMLButtonElement;
  const btnCloseCredits = document.getElementById('btn-close-credits') as HTMLButtonElement;
  const modalCredits = document.getElementById('modal-credits') as HTMLElement;
  const modalContent = document.getElementById('modal-content') as HTMLElement;

  const openModal = () => {
    if (!modalCredits || !modalContent) return;
    sfx.playClick();
    modalCredits.classList.remove('opacity-0', 'pointer-events-none');
    modalCredits.classList.add('opacity-100', 'pointer-events-auto');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  };

  const closeModal = () => {
    if (!modalCredits || !modalContent) return;
    sfx.playClick();
    modalCredits.classList.remove('opacity-100', 'pointer-events-auto');
    modalCredits.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
  };

  btnCredits?.addEventListener('click', openModal);
  btnCloseCredits?.addEventListener('click', closeModal);

  modalCredits?.addEventListener('click', (e) => {
    if (e.target === modalCredits) closeModal();
  });
});