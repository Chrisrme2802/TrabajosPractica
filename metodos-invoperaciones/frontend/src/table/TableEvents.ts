import type { TableState } from './TableState.js';

export class TableEvents {
  public static bind(
    container: HTMLElement,
    state: TableState,
    onFullRenderNeeded: () => void,
    onTotalsOnlyNeeded: () => void
  ): void {
    // Botones estructurales
    container.querySelector('#btn-add-row')?.addEventListener('click', () => {
      state.addRow();
      onFullRenderNeeded();
    });

    container.querySelector('#btn-add-col')?.addEventListener('click', () => {
      state.addColumn();
      onFullRenderNeeded();
    });

    // Delegación para eliminar filas/columnas
    container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');

      if (action === 'remove-row') {
        const r = parseInt(target.getAttribute('data-row') || '0', 10);
        state.removeRow(r);
        onFullRenderNeeded();
      } else if (action === 'remove-col') {
        const c = parseInt(target.getAttribute('data-col') || '0', 10);
        state.removeColumn(c);
        onFullRenderNeeded();
      }
    });

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
    });
  }
}