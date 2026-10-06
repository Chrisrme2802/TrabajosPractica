import type { TransportStep, TransportResult } from './types/transport.js';
import { THEME } from './theme.js';

export class StepVisualizer {
  private container: HTMLElement;
  private response: TransportResult | null = null;
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
    solution: TransportResult,
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
    const isHungarian = currentStep.coveredRows !== undefined || 
                        currentStep.coveredCols !== undefined || 
                        this.response.steps.some(s => s.coveredRows !== undefined);
    const isLastStep = this.currentStepIndex === this.response.steps.length - 1;

    const stepMatrix = currentStep.currentAllocations;
    const numRows = stepMatrix.length;
    const numCols = stepMatrix[0]?.length || 0;

    const displaySources = Array.from({ length: numRows }, (_, i) =>
      this.sources[i] || `Ficticio ${i + 1}`
    );
    const displayDestinations = Array.from({ length: numCols }, (_, j) =>
      this.destinations[j] || `Ficticio ${j + 1}`
    );

    let html = `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-6">
        
        <!-- Controles de Reproducción -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 text-white p-4 rounded-lg">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Visualizador Paso a Paso</span>
            <h3 class="text-lg font-bold text-emerald-400">Paso ${currentStep.stepNumber} de ${this.response.steps.length}</h3>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-first" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${this.currentStepIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>Inicio</button>
            <button id="btn-prev" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${this.currentStepIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>Anter.</button>
            <button id="btn-play" class="px-4 py-1.5 ${this.autoPlayInterval ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded text-sm font-bold transition">
              ${this.autoPlayInterval ? 'Pausa' : 'Reproducir'}
            </button>
            <button id="btn-next" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${isLastStep ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>Siguiente</button>
            <button id="btn-last" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-semibold transition" ${isLastStep ? 'disabled class="opacity-40 cursor-not-allowed"' : ''}>Fin</button>
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

    displayDestinations.forEach(dest => {
      html += `<th class="p-2 border min-w-[110px]">${dest}</th>`;
    });

    if (!isHungarian) {
      html += `<th class="p-2 border bg-emerald-100 text-emerald-900">Oferta Restante</th>`;
    }
    if (isVogel) {
      html += `<th class="p-2 border bg-amber-100 text-amber-900">Penalización Fila</th>`;
    }

    html += `</tr></thead><tbody>`;

    displaySources.forEach((source, r) => {
      const isRowDiscarded = !isHungarian && currentStep.remainingSupply[r] === 0;

      html += `<tr class="${isRowDiscarded ? THEME.discarded.rowBg : 'hover:bg-slate-50'}">`;
      html += `<td class="p-2 border font-semibold ${isRowDiscarded ? THEME.discarded.headerBg : 'bg-slate-50'}">${source}</td>`;

      displayDestinations.forEach((_, c) => {
        const isColDiscarded = !isHungarian && currentStep.remainingDemand[c] === 0;
        const isCellDiscarded = isRowDiscarded || isColDiscarded;

        const originalCost = this.costs[r]?.[c] ?? 0;
        const currentVal = stepMatrix[r]?.[c] ?? 0;
        const isSelected = currentStep.selectedCell?.row === r && currentStep.selectedCell?.col === c;

        const isRowCovered = currentStep.coveredRows?.[r] ?? false;
        const isColCovered = currentStep.coveredCols?.[c] ?? false;
        const isIntersection = isRowCovered && isColCovered;

        let cellClass = 'p-2 border relative transition-all duration-300 ';

        if (isHungarian) {
          if (isIntersection) {
            cellClass += `${THEME.hungarian.intersectionBg} ${THEME.hungarian.intersectionBorder} font-bold `;
          } else if (isRowCovered || isColCovered) {
            cellClass += `${THEME.hungarian.coveredBg} ${THEME.hungarian.coveredBorder} `;
          } else if (isLastStep && currentVal === 1) {
            cellClass += `${THEME.cells.finalAssignment} `;
          }
        } else {
          if (isSelected) {
            cellClass += `${THEME.cells.selected} `;
          } else if (currentVal > 0) {
            cellClass += `${THEME.cells.allocated} `;
          } else if (isCellDiscarded) {
            cellClass += `${THEME.discarded.cellBg} `;
          }
        }

        let lineOverlay = '';
        if (isHungarian) {
          if (isIntersection) {
            lineOverlay = `
              <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 z-10 pointer-events-none"></div>
              <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-red-600 z-10 pointer-events-none"></div>
              <div class="absolute inset-0 border-2 border-purple-600 z-20 pointer-events-none"></div>
            `;
          } else if (isRowCovered) {
            lineOverlay = `<div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 z-10 pointer-events-none"></div>`;
          } else if (isColCovered) {
            lineOverlay = `<div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-red-600 z-10 pointer-events-none"></div>`;
          }
        }

        html += `
          <td class="${cellClass}">
            ${lineOverlay}
            <span class="absolute top-1 right-1 text-[10px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded z-20">
              $${originalCost}
            </span>
            <div class="mt-3 text-base font-extrabold relative z-20 ${currentVal > 0 ? 'text-emerald-800' : isCellDiscarded ? 'text-red-400' : 'text-slate-400'}">
              ${currentVal > 0 ? currentVal : '-'}
            </div>
          </td>
        `;
      });

      if (!isHungarian) {
        const supplyTextClass = currentStep.remainingSupply[r] === 0 
          ? THEME.discarded.badge 
          : 'text-emerald-700 bg-emerald-50/50 font-bold';

        html += `
          <td class="p-2 border font-mono ${supplyTextClass}">
            ${currentStep.remainingSupply[r]}
          </td>
        `;
      }

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

    if (!isHungarian) {
      html += `
        <tr class="bg-blue-50/60 font-semibold text-blue-900">
          <td class="p-2 border">Demanda Restante</td>
      `;

      displayDestinations.forEach((_, c) => {
        const isColDisabled = currentStep.remainingDemand[c] === 0;
        const demandTextClass = isColDisabled 
          ? THEME.discarded.badge 
          : 'text-blue-700 font-bold';

        html += `
          <td class="p-2 border font-mono ${demandTextClass}">
            ${currentStep.remainingDemand[c]}
          </td>
        `;
      });

      html += `<td class="p-2 border"></td>`;
      if (isVogel) html += `<td class="p-2 border"></td>`;
      html += `</tr>`;
    }

    if (isVogel) {
      html += `
        <tr class="bg-amber-50/60 font-semibold text-amber-900">
          <td class="p-2 border">Penalización Columna</td>
      `;
      displayDestinations.forEach((_, c) => {
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
            <p class="text-emerald-200 text-sm">Se han realizado las asignaciones óptimas de costo mínimo.</p>
          </div>
          <div class="text-right">
            <span class="text-xs uppercase text-emerald-300 font-semibold">Costo Total Solución (Z)</span>
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