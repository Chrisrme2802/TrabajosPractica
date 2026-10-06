import type { TableState } from './TableState.js';
import type { TransportMethod } from '../types/transport.js';
import { THEME } from '../theme.js';

export class TableRenderer {
  public static render(state: TableState, method: TransportMethod = 'vogel'): string {
    const isHungarian = method === 'hungarian';
    const numRows = state.sources.length;
    const numCols = state.destinations.length;
    const isSquare = numRows === numCols;

    const { balanced, totalSupply, totalDemand } = state.isBalanced();

    // Determinar mensaje e insignia de estado consumiendo THEME
    let badgeClass = '';
    let badgeText = '';

    if (isHungarian) {
      if (isSquare) {
        badgeClass = THEME.badge.hungarianSquare;
        badgeText = `✓ Matriz Cuadrada (${numRows}x${numCols})`;
      } else {
        badgeClass = 'bg-red-100 text-red-800 border border-red-300 font-bold';
        badgeText = `⚠ Matriz no cuadrada (${numRows}x${numCols}) — El Método Húngaro requiere dimensiones iguales (N x N)`;
      }
    } else {
      if (balanced) {
        badgeClass = THEME.badge.balanced;
        badgeText = `Oferta y Demanda Balanceadas (${totalSupply})`;
      } else {
        badgeClass = THEME.badge.unbalanced;
        badgeText = `Desbalanceado — Oferta: ${totalSupply} | Demanda: ${totalDemand}`;
      }
    }

    let html = `
      <div class="overflow-x-auto bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <div class="flex justify-between items-center mb-4 gap-2">
          <div class="flex gap-2">
            <button id="btn-add-row" class="px-3 py-1.5 ${THEME.buttons.addRow} text-sm font-medium rounded-lg transition">+ Fila (Origen)</button>
            <button id="btn-add-col" class="px-3 py-1.5 ${THEME.buttons.addCol} text-sm font-medium rounded-lg transition">+ Columna (Destino)</button>
          </div>
          <div id="balance-badge" class="text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}">
            ${badgeText}
          </div>
        </div>

        <table class="w-full text-sm text-center border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
              <th class="p-2 border border-slate-200">Orígenes / Destinos</th>
    `;

    state.destinations.forEach((dest, c) => {
      html += `
        <th class="p-2 border border-slate-200 min-w-[100px]">
          <div class="flex items-center justify-between gap-1">
            <input type="text" value="${dest}" data-type="dest" data-col="${c}" class="w-full bg-transparent font-semibold text-center border-b border-transparent focus:border-blue-500 outline-none" />
            ${state.destinations.length > 1 ? `<button data-action="remove-col" data-col="${c}" class="${THEME.buttons.remove} px-1.5 py-0.5 rounded transition">✕</button>` : ''}
          </div>
        </th>
      `;
    });

    // Estilos de encabezado Oferta
    const supplyHeaderClass = isHungarian
      ? `p-2 border border-slate-200 ${THEME.hungarian.disabledHeader} w-28`
      : 'p-2 border border-slate-200 bg-emerald-50 text-emerald-900 w-28';

    html += `
              <th class="${supplyHeaderClass}">Oferta</th>
              <th class="p-2 border border-slate-200 w-10"></th>
            </tr>
          </thead>
          <tbody>
    `;

    state.sources.forEach((source, r) => {
      html += `
        <tr class="border-b border-slate-200 hover:bg-slate-50 transition-colors">
          <td class="p-2 border border-slate-200 font-semibold bg-slate-50 text-slate-700">
            <input type="text" value="${source}" data-type="source" data-row="${r}" class="w-full bg-transparent font-semibold text-center border-b border-transparent focus:border-blue-500 outline-none" />
          </td>
      `;

      state.destinations.forEach((_, c) => {
        html += `
          <td class="p-2 border border-slate-200">
            <input type="number" min="0" value="${state.costs[r][c]}" data-type="cost" data-row="${r}" data-col="${c}" class="w-full text-center p-1 rounded border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
          </td>
        `;
      });

      // Inputs de oferta inhabilitados
      const supplyInputClass = isHungarian
        ? `w-full text-center p-1 rounded border ${THEME.hungarian.disabledInput} font-mono`
        : 'w-full text-center p-1 rounded border border-emerald-300 font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono';

      html += `
          <td class="p-2 border border-slate-200 ${isHungarian ? THEME.hungarian.disabledCellBg : 'bg-emerald-50'}">
            <input type="number" min="0" value="${state.supply[r]}" data-type="supply" data-row="${r}" ${isHungarian ? 'disabled' : ''} class="${supplyInputClass}" />
          </td>
          <td class="p-1 border border-slate-200">
            ${state.sources.length > 1 ? `<button data-action="remove-row" data-row="${r}" class="${THEME.buttons.remove} px-2 py-1 rounded transition">✕</button>` : ''}
          </td>
        </tr>
      `;
    });

    // Fila final de demandas
    const demandRowClass = isHungarian ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-900';

    html += `
        <tr class="${demandRowClass} font-semibold">
          <td class="p-2 border border-slate-200 ${isHungarian ? THEME.hungarian.disabledHeader : ''}">Demanda</td>
    `;

    state.destinations.forEach((_, c) => {
      const demandInputClass = isHungarian
        ? `w-full text-center p-1 rounded border ${THEME.hungarian.disabledInput} font-mono`
        : 'w-full text-center p-1 rounded border border-blue-300 font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono';

      html += `
        <td class="p-2 border border-slate-200">
          <input type="number" min="0" value="${state.demand[c]}" data-type="demand" data-col="${c}" ${isHungarian ? 'disabled' : ''} class="${demandInputClass}" />
        </td>
      `;
    });

    const totalCellText = isHungarian ? 'N/A' : `${totalSupply} / ${totalDemand}`;

    html += `
          <td id="total-cell" class="p-2 border border-slate-200 ${isHungarian ? 'bg-red-200/80 text-red-700 font-extrabold' : 'bg-slate-200 text-slate-800'} font-mono">${totalCellText}</td>
          <td class="p-2 border border-slate-200"></td>
        </tr>
      </tbody>
    </table>
  </div>
    `;

    return html;
  }
}