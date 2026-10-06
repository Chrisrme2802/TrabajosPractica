import type { TransportInput, TransportMethod } from '../types/transport.js';

export class TableState {
  public sources: string[] = ['Origen 1', 'Origen 2', 'Origen 3'];
  public destinations: string[] = ['Destino 1', 'Destino 2', 'Destino 3'];
  public costs: number[][] = [
    [8, 5, 6],
    [15, 10, 12],
    [3, 9, 10]
  ];
  public supply: number[] = [120, 80, 80];
  public demand: number[] = [150, 70, 60];

  public addRow(): void {
    const newIdx = this.sources.length + 1;
    this.sources.push(`Origen ${newIdx}`);
    this.supply.push(0);
    this.costs.push(new Array(this.destinations.length).fill(0));
  }

  public removeRow(index: number): void {
    if (this.sources.length <= 1) return;
    this.sources.splice(index, 1);
    this.supply.splice(index, 1);
    this.costs.splice(index, 1);
  }

  public addColumn(): void {
    const newIdx = this.destinations.length + 1;
    this.destinations.push(`Destino ${newIdx}`);
    this.demand.push(0);
    this.costs.forEach(row => row.push(0));
  }

  public removeColumn(index: number): void {
    if (this.destinations.length <= 1) return;
    this.destinations.splice(index, 1);
    this.demand.splice(index, 1);
    this.costs.forEach(row => row.splice(index, 1));
  }

  public isBalanced(): { balanced: boolean; totalSupply: number; totalDemand: number } {
    const totalSupply = this.supply.reduce((a, b) => a + b, 0);
    const totalDemand = this.demand.reduce((a, b) => a + b, 0);
    return { balanced: totalSupply === totalDemand, totalSupply, totalDemand };
  }

  public toPayload(method: TransportMethod): TransportInput {
    return {
      sources: [...this.sources],
      destinations: [...this.destinations],
      costs: this.costs.map(row => [...row]),
      supply: [...this.supply],
      demand: [...this.demand],
      method
    };
  }
}