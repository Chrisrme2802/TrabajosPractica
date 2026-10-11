import type { GraphRenderer } from './graph-renderer.js';
import type { Step, DijkstraResponse } from '../types/dijkstra-types.js';
import type { SoundEffects } from '../services/sound-effects.js';

export class AnimationController {
  private renderer: GraphRenderer;
  private sounds: SoundEffects;
  private steps: Step[] = [];
  private finalPath: string[] = [];
  private totalDistance: number = 0;
  private currentStepIndex: number = -1;
  private timer: number | null = null;
  private speedMs: number = 500;

  private btnPlay: HTMLButtonElement | null;
  private btnPrev: HTMLButtonElement | null;
  private btnNext: HTMLButtonElement | null;
  private speedInput: HTMLInputElement | null;
  private statusIndicator: HTMLElement | null;

  private stepCounter: HTMLElement | null;
  private stepDescription: HTMLElement | null;
  private pathSummary: HTMLElement | null;
  private summaryPathText: HTMLElement | null;
  private summaryDistanceText: HTMLElement | null;

  constructor(renderer: GraphRenderer, sounds: SoundEffects) {
    this.renderer = renderer;
    this.sounds = sounds;

    this.btnPlay = document.getElementById('btn-play') as HTMLButtonElement | null;
    this.btnPrev = document.getElementById('btn-prev') as HTMLButtonElement | null;
    this.btnNext = document.getElementById('btn-next') as HTMLButtonElement | null;
    this.speedInput = document.getElementById('speed-range') as HTMLInputElement | null;
    this.statusIndicator = document.getElementById('status-indicator');

    this.stepCounter = document.getElementById('step-counter');
    this.stepDescription = document.getElementById('step-description');
    this.pathSummary = document.getElementById('path-summary');
    this.summaryPathText = document.getElementById('summary-path-text');
    this.summaryDistanceText = document.getElementById('summary-distance-text');

    this.initEvents();
  }

  private initEvents(): void {
    this.btnPlay?.addEventListener('click', () => this.togglePlay());
    this.btnPrev?.addEventListener('click', () => this.stepBackward());
    this.btnNext?.addEventListener('click', () => this.stepForward());

    this.speedInput?.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.speedMs = 1600 - parseInt(target.value, 10);
      if (this.isPlaying()) {
        this.pause();
        this.play();
      }
    });
  }

  public loadExecution(response: DijkstraResponse): void {
    this.reset();
    this.steps = response.steps;
    this.finalPath = response.path;
    this.totalDistance = response.totalDistance;

    if (this.steps.length > 0) {
      this.currentStepIndex = 0;
      this.renderCurrentStep();
    }
  }

  public isPlaying(): boolean {
    return this.timer !== null;
  }

  public play(): void {
    if (this.steps.length === 0) return;
    if (this.currentStepIndex >= this.steps.length - 1) {
      this.currentStepIndex = 0;
    }

    if (this.btnPlay) this.btnPlay.textContent = 'Pausar';
    if (this.statusIndicator) {
      this.statusIndicator.textContent = 'Ejecutando...';
      this.statusIndicator.className = 'text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono';
    }

    this.timer = window.setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.stepForward();
      } else {
        this.pause();
        this.highlightFinalPath();
      }
    }, this.speedMs);
  }

  public pause(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.btnPlay) this.btnPlay.textContent = 'Reproducir';
    if (this.statusIndicator) {
      this.statusIndicator.textContent = 'Pausado';
      this.statusIndicator.className = 'text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono';
    }
  }

  public togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  public stepForward(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.sounds.playStep(); // Sonido en cada paso hacia adelante
      this.renderCurrentStep();
    } else {
      this.highlightFinalPath();
    }
  }

  public stepBackward(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.sounds.playStep(); // Sonido en cada paso hacia atrás
      this.renderCurrentStep();
    }
  }

  private renderCurrentStep(): void {
    const step = this.steps[this.currentStepIndex];
    if (!step) return;

    if (this.pathSummary) this.pathSummary.classList.add('hidden');

    if (this.stepCounter) {
      this.stepCounter.textContent = `Paso ${this.currentStepIndex + 1} / ${this.steps.length}`;
    }
    if (this.stepDescription) {
      this.stepDescription.textContent = step.description;
    }

    this.renderer.renderStepState(step);
    this.updateControlsState();
  }

  private highlightFinalPath(): void {
    if (this.statusIndicator) {
      this.statusIndicator.textContent = 'Ruta Calculada';
      this.statusIndicator.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono';
    }

    if (this.pathSummary && this.summaryPathText && this.summaryDistanceText) {
      if (this.finalPath.length > 0) {
        this.summaryPathText.textContent = this.finalPath.join(' ➔ ');
        this.summaryDistanceText.textContent = `Costo Total Mínimo: ${this.totalDistance}`;
        this.sounds.playSuccess(); // Acorde de éxito al completar la ruta
      } else {
        this.summaryPathText.textContent = 'No existe ruta alcanzable';
        this.summaryDistanceText.textContent = 'Distancia: ∞';
      }
      this.pathSummary.classList.remove('hidden');
    }

    this.renderer.renderFinalPath(this.finalPath);
  }

  private updateControlsState(): void {
    if (this.btnPrev) this.btnPrev.disabled = this.currentStepIndex <= 0;
    if (this.btnNext) this.btnNext.disabled = this.currentStepIndex >= this.steps.length - 1;
  }

  public reset(): void {
    this.pause();
    this.steps = [];
    this.finalPath = [];
    this.totalDistance = 0;
    this.currentStepIndex = -1;

    if (this.pathSummary) this.pathSummary.classList.add('hidden');
    if (this.stepCounter) this.stepCounter.textContent = 'Paso 0 / 0';
    if (this.stepDescription) {
      this.stepDescription.textContent = 'Crea un grafo y presiona "Calcular Ruta" para iniciar la simulación.';
    }

    this.updateControlsState();
    this.renderer.resetVisualStates();
  }
}