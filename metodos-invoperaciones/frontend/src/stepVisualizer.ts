import type { TransportStep, TransportSolutionResponse } from './types/transport.js';

export class StepVisualizer {
  private container: HTMLElement;
  private response: TransportSolutionResponse | null = null;
  private currentStepIndex: number = 0;
  private sources: string[] = [];
  private destinations: string[] = [];
  private costs: number[][] = [];
  private autoPlayInterval: number | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Contenedor #${containerId} no encontrado.`);
    this.container = el;
  }

  public setSolution(
    solution: TransportSolutionResponse,
    sources: string[],
    destinations: string[],
    costs: number[][]
  ): void {
    this.response = solution;
    this.sources = sources;
    this.destinations = destinations;
    this.costs = costs;
    this.currentStepIndex = 0;
    this.stopAutoPlay();
    this.render();
  }

  public nextStep(): void {
    if (!this.response || this.currentStepIndex >= this.response.steps.length - 1) {
      this.stopAutoPlay();
      return;
    }
    this.currentStepIndex++;
    this.render();
  }

  public prevStep(): void {
    if (!this.response || this.currentStepIndex <= 0) return;
    this.currentStepIndex--;
    this.render();
  }

  public toggleAutoPlay(): void {
    if (this.autoPlayInterval) {
      this.stopAutoPlay();
    } else {
      this.autoPlayInterval = window.setInterval(() => {
        if (this.response && this.currentStepIndex < this.response.steps.length - 1) {
          this.nextStep();
        } else {
          this.stopAutoPlay();
        }
      }, 1500);
      this.renderControlsOnly();
    }
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      this.renderControlsOnly();
    }
  }

  public render(): void {
    if (!this.response) {
      this.container.innerHTML = `
        <div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500">
          <p class="font-medium">Ingresa los datos en la tabla y presiona <strong>"Resolver Problema"</strong> para ver la animación paso a paso.</p>
        </div>
      `;
      return;
    }

    const currentStep: TransportStep = this.response.steps[this.currentStepIndex];
    const isVogel = currentStep.rowPenalties !== undefined;
    const isLastStep = this.currentStepIndex === this.response.steps.length - 1;

    let html = `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-6">
        
        <!-- Controles de Reproducción -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 text-white p-4 rounded-lg">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Visualizador Paso a Paso</span>
            <h3 class="text-lg font-bold text-emerald-400">Paso ${currentStep.stepNumber} de ${this.response.steps.length}</h3>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-first" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${this.currentStepIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>⏪ Inicio</button>
            <button id="btn-prev" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${this.currentStepIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>◀ Anter.</button>
            <button id="btn-play" class="px-4 py-1.5 ${this.autoPlayInterval ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded text-sm font-bold transition">
              ${this.autoPlayInterval ? '⏸ Pausa' : '▶ Reproducir'}
            </button>
            <button id="btn-next" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${isLastStep ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>Siguiente ▶</button>
            <button id="btn-last" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${isLastStep ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>⏩ Fin</button>
          </div>
        </div>

        <!-- Banner Explicativo -->
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <p class="text-blue-900 font-medium">${currentStep.description}</p>
        </div>

        <!-- Matriz Animada -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-center border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-semibold border-b">
                <th class="p-2 border">Origen / Destino</th>
    `;

    this.destinations.forEach(dest => {
      html += `<th class="p-2 border min-w-[110px]">${dest}</th>`;
    });

    html += `<th class="p-2 border bg-emerald-100 text-emerald-900">Oferta Restante</th>`;
    if (isVogel) html += `<th class="p-2 border bg-amber-100 text-amber-900">Penalización Fila</th>`;
    html += `</tr></thead><tbody>`;

    this.sources.forEach((source, r) => {
      const isRowDisabled = currentStep.remainingSupply[r] === 0;

      html += `<tr class="${isRowDisabled ? 'bg-slate-100 text-slate-400' : 'hover:bg-slate-50'}">`;
      html += `<td class="p-2 border font-semibold bg-slate-50">${source}</td>`;

      this.destinations.forEach((_, c) => {
        const cost = this.costs[r][c];
        const allocation = currentStep.currentAllocations[r][c];
        const isSelected = currentStep.selectedCell?.row === r && currentStep.selectedCell?.col === c;

        let cellClass = 'p-2 border relative transition-all duration-300 ';
        if (isSelected) {
          cellClass += 'bg-emerald-200 border-2 border-emerald-600 ring-2 ring-emerald-400 ';
        } else if (allocation > 0) {
          cellClass += 'bg-emerald-50 ';
        }

        html += `
          <td class="${cellClass}">
            <span class="absolute top-1 right-1 text-[10px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
              $${cost}
            </span>
            <div class="mt-3 text-base font-extrabold ${allocation > 0 ? 'text-emerald-700' : 'text-slate-300'}">
              ${allocation > 0 ? allocation : '-'}
            </div>
          </td>
        `;
      });

      html += `
        <td class="p-2 border font-bold font-mono ${currentStep.remainingSupply[r] === 0 ? 'text-slate-400 line-through' : 'text-emerald-700 bg-emerald-50/50'}">
          ${currentStep.remainingSupply[r]}
        </td>
      `;

      if (isVogel) {
        const penalty = currentStep.rowPenalties?.[r];
        html += `
          <td class="p-2 border font-bold font-mono text-amber-700 bg-amber-50/50">
            ${penalty !== null && penalty !== undefined ? penalty : '—'}
          </td>
        `;
      }

      html += `</tr>`;
    });

    // Fila de Demanda Restante
    html += `
      <tr class="bg-blue-50/60 font-semibold text-blue-900">
        <td class="p-2 border">Demanda Restante</td>
    `;

    this.destinations.forEach((_, c) => {
      const isColDisabled = currentStep.remainingDemand[c] === 0;
      html += `
        <td class="p-2 border font-mono font-bold ${isColDisabled ? 'text-slate-400 line-through' : 'text-blue-700'}">
          ${currentStep.remainingDemand[c]}
        </td>
      `;
    });

    html += `<td class="p-2 border"></td>`;
    if (isVogel) html += `<td class="p-2 border"></td>`;
    html += `</tr>`;

    // Penalizaciones de Columna para Vogel
    if (isVogel) {
      html += `
        <tr class="bg-amber-50/60 font-semibold text-amber-900">
          <td class="p-2 border">Penalización Columna</td>
      `;
      this.destinations.forEach((_, c) => {
        const penalty = currentStep.colPenalties?.[c];
        html += `
          <td class="p-2 border font-mono font-bold text-amber-800">
            ${penalty !== null && penalty !== undefined ? penalty : '—'}
          </td>
        `;
      });
      html += `<td class="p-2 border"></td><td class="p-2 border"></td></tr>`;
    }

    html += `</tbody></table></div>`;

    if (isLastStep) {
      html += `
        <div class="bg-emerald-800 text-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h4 class="font-bold text-lg">¡Solución Completada!</h4>
            <p class="text-emerald-200 text-sm">Se han satisfecho todas las demandas y ofertas.</p>
          </div>
          <div class="text-right">
            <span class="text-xs uppercase text-emerald-300 font-semibold">Costo Total Solución Inicial (Z)</span>
            <div class="text-3xl font-black text-amber-300">$${this.response.totalCost}</div>
          </div>
        </div>
      `;
    }

    html += `</div>`;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  private renderControlsOnly(): void {
    const playBtn = this.container.querySelector('#btn-play');
    if (playBtn) {
      playBtn.className = `px-4 py-1.5 ${this.autoPlayInterval ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded text-sm font-bold transition`;
      playBtn.textContent = this.autoPlayInterval ? 'Pausa' : 'Reproducir';
    }
  }

  private attachEvents(): void {
    this.container.querySelector('#btn-first')?.addEventListener('click', () => {
      this.currentStepIndex = 0;
      this.render();
    });
    this.container.querySelector('#btn-prev')?.addEventListener('click', () => this.prevStep());
    this.container.querySelector('#btn-next')?.addEventListener('click', () => this.nextStep());
    this.container.querySelector('#btn-last')?.addEventListener('click', () => {
      if (this.response) {
        this.currentStepIndex = this.response.steps.length - 1;
        this.render();
      }
    });
    this.container.querySelector('#btn-play')?.addEventListener('click', () => this.toggleAutoPlay());
  }
}