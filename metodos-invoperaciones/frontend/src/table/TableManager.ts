import { TableState } from './TableState.js';
import { TableRenderer } from './TableRenderer.js';
import { TableEvents } from './TableEvents.js';
import type { TransportInput, TransportMethod } from '../types/transport.js';

export class TableManager {
  private container: HTMLElement;
  public state: TableState;
  private currentMethod: TransportMethod = 'vogel';

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Contenedor #${containerId} no encontrado.`);
    this.container = el;
    this.state = new TableState();
    this.render();
  }

  public setMethod(method: TransportMethod): void {
    this.currentMethod = method;
    this.render();
  }

  public getData(method: TransportMethod): TransportInput {
    return this.state.toPayload(method);
  }

  public render(): void {
    this.container.innerHTML = TableRenderer.render(this.state, this.currentMethod);
    TableEvents.bind(
      this.container,
      this.state,
      () => this.render(),
      () => this.updateTotalsOnly()
    );
  }

  private updateTotalsOnly(): void {
    if (this.currentMethod === 'hungarian') return;

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