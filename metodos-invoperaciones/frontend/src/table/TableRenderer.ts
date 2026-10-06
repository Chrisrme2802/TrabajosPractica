import type { TableState } from './TableState.js';

export class TableRenderer {
  public static render(state: TableState): string {
    const { balanced, totalSupply, totalDemand } = state.isBalanced();

    let html = `
      <div class="overflow-x-auto bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <div class="flex justify-between items-center mb-4 gap-2">
          <div class="flex gap-2">
            <button id="btn-add-row" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition">+ Fila (Origen)</button>
            <button id="btn-add-col" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">+ Columna (Destino)</button>
          </div>
          <div id="balance-badge" class="text-xs font-semibold px-3 py-1 rounded-full ${balanced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${balanced ? `Oferta y Demanda Balanceadas (${totalSupply})` : `Desbalanceado — Oferta: ${totalSupply} \vert{} Demanda:${totalDemand}`}
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
            ${state.destinations.length > 1 ? `<button data-action="remove-col" data-col="${c}" class="text-red-400 hover:text-red-600 font-bold px-1">✕</button>` : ''}
          </div>
        </th>
      `;
    });

    html += `
              <th class="p-2 border border-slate-200 bg-emerald-50 text-emerald-900 w-28">Oferta</th>
              <th class="p-2 border border-slate-200 w-10"></th>
            </tr>
          </thead>
          <tbody>
    `;

    state.sources.forEach((source, r) => {
      html += `
        <tr class="border-b border-slate-200 hover:bg-slate-50">
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

      html += `
          <td class="p-2 border border-slate-200 bg-emerald-50">
            <input type="number" min="0" value="${state.supply[r]}" data-type="supply" data-row="${r}" class="w-full text-center p-1 rounded border border-emerald-300 font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 outline-none font-mono" />
          </td>
          <td class="p-1 border border-slate-200">
            ${state.sources.length > 1 ? `<button data-action="remove-row" data-row="${r}" class="text-red-400 hover:text-red-600 font-bold px-2 py-1">✕</button>` : ''}
          </td>
        </tr>
      `;
    });

    html += `
        <tr class="bg-blue-50 font-semibold text-blue-900">
          <td class="p-2 border border-slate-200">Demanda</td>
    `;

    state.destinations.forEach((_, c) => {
      html += `
        <td class="p-2 border border-slate-200">
          <input type="number" min="0" value="${state.demand[c]}" data-type="demand" data-col="${c}" class="w-full text-center p-1 rounded border border-blue-300 font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
        </td>
      `;
    });

    html += `
          <td id="total-cell" class="p-2 border border-slate-200 bg-slate-200 text-slate-800 font-mono font-bold">${totalSupply} / ${totalDemand}</td>
          <td class="p-2 border border-slate-200"></td>
        </tr>
      </tbody>
    </table>
  </div>
    `;

    return html;
  }
}