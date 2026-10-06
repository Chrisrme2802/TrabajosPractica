import { TableState } from './TableState.js';
import { TableRenderer } from './TableRenderer.js';
import { TableEvents } from './TableEvents.js';
import type { TransportProblemInput } from '../types/transport.js';

export class TableManager {
  private container: HTMLElement;
  public state: TableState;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Contenedor #${containerId} no encontrado.`);
    this.container = el;
    this.state = new TableState();
    this.render();
  }

  public getData(method: 'northwest' | 'minimum-cost' | 'vogel'): TransportProblemInput {
    return this.state.toPayload(method);
  }

  public render(): void {
    this.container.innerHTML = TableRenderer.render(this.state);
    TableEvents.bind(
      this.container,
      this.state,
      () => this.render(),
      () => this.updateTotalsOnly()
    );
  }

  private updateTotalsOnly(): void {
    const { balanced, totalSupply, totalDemand } = this.state.isBalanced();
    const badge = this.container.querySelector('#balance-badge');
    const totalCell = this.container.querySelector('#total-cell');

    if (badge) {
      badge.className = `text-xs font-semibold px-3 py-1 rounded-full ${balanced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`;
      badge.textContent = balanced ? `✓ Oferta y Demanda Balanceadas (${totalSupply})` : `⚠ Desbalanceado — Oferta: ${totalSupply} | Demanda: ${totalDemand}`;
    }

    if (totalCell) {
      totalCell.textContent = `${totalSupply} / ${totalDemand}`;
    }
  }
}