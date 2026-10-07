import type { TableState } from './TableState.js';
import { sfx } from '../sfx.js';

export class TableEvents {
  private static controller: AbortController | null = null;

  public static bind(
    container: HTMLElement,
    state: TableState,
    onFullRenderNeeded: () => void,
    onTotalsOnlyNeeded: () => void
  ): void {
    // Si ya existían eventos registrados en este contenedor, los cancelamos todos de golpe
    if (TableEvents.controller) {
      TableEvents.controller.abort();
    }
    
    // Creamos un nuevo controlador para la llamada actual
    TableEvents.controller = new AbortController();
    const { signal } = TableEvents.controller;

    // Botones estructurales (+ Fila / + Columna)
    container.querySelector('#btn-add-row')?.addEventListener('click', () => {
      sfx.playClick();
      state.addRow();
      onFullRenderNeeded();
    }, { signal });

    container.querySelector('#btn-add-col')?.addEventListener('click', () => {
      sfx.playClick();
      state.addColumn();
      onFullRenderNeeded();
    }, { signal });

    // Delegación para eliminar filas/columnas
    container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');

      if (action === 'remove-row') {
        const r = parseInt(target.getAttribute('data-row') || '0', 10);
        sfx.playClick();
        state.removeRow(r);
        onFullRenderNeeded();
      } else if (action === 'remove-col') {
        const c = parseInt(target.getAttribute('data-col') || '0', 10);
        sfx.playClick();
        state.removeColumn(c);
        onFullRenderNeeded();
      }
    }, { signal });

    // Edición de celdas
    container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const type = target.getAttribute('data-type');
      const val = parseFloat(target.value) || 0;

      if (type === 'cost') {
        const r = parseInt(target.getAttribute('data-row') || '0', 10);
        const c = parseInt(target.getAttribute('data-col') || '0', 10);
        state.costs[r][c] = val;
      } else if (type === 'supply') {
        const r = parseInt(target.getAttribute('data-row') || '0', 10);
        state.supply[r] = val;
        onTotalsOnlyNeeded();
      } else if (type === 'demand') {
        const c = parseInt(target.getAttribute('data-col') || '0', 10);
        state.demand[c] = val;
        onTotalsOnlyNeeded();
      } else if (type === 'source') {
        const r = parseInt(target.getAttribute('data-row') || '0', 10);
        state.sources[r] = target.value;
      } else if (type === 'dest') {
        const c = parseInt(target.getAttribute('data-col') || '0', 10);
        state.destinations[c] = target.value;
      }
    }, { signal });
  }
}