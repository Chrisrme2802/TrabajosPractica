import * as PIXI from 'pixi.js';
import './style.css';
import type { AppConfig, ShapeType } from './types';
import { ColorUtils } from './ColorUtils';
import { PatternRenderer } from './PatternRenderer';

class ApplicationController {
  private app!: PIXI.Application;
  private renderer!: PatternRenderer;
  private config: AppConfig;

  constructor() {
    this.config = {
      maxSize: 500,
      step: 5,               // 500 / 5 = 100 capas por defecto
      rotSpeed: 1,
      shape: 'square',
      pulseSpeed: 2,
      pulseAmount: 0.05,
      alpha: 0.3,
      stroke: false,
      strokeWidth: 1.5,
      strokeColor: 0xffffff, // Blanco por defecto
      colorInner: { r: 255, g: 255, b: 0 },
      colorOuter: { r: 255, g: 95, b: 105 },
      bgColor: 0x640064
    };

    this.init();
  }

  private async init(): Promise<void> {
    const canvasContainer = document.getElementById('canvas-container') as HTMLElement;

    this.app = new PIXI.Application();
    
    await this.app.init({
      resizeTo: canvasContainer,
      backgroundColor: this.config.bgColor,
      antialias: true
    });

    canvasContainer.appendChild(this.app.canvas);

    this.renderer = new PatternRenderer();
    this.app.stage.addChild(this.renderer.container);

    this.centerContainer();
    this.renderer.rebuildPattern(this.config);

    this.app.ticker.add(() => {
      this.renderer.updateRotations(this.config.rotSpeed);
    });

    this.syncUIInitialValues();
    this.setupEvents();
  }

  private centerContainer(): void {
    this.renderer.container.x = this.app.screen.width / 2;
    this.renderer.container.y = this.app.screen.height / 2;
  }

  /**
   * Sincroniza la posición visual de las barras con la configuración real inicial
   */
  private syncUIInitialValues(): void {
    const initialLayers = this.config.maxSize / this.config.step;

    const densitySlider = document.getElementById('density-slider') as HTMLInputElement;
    const densityVal = document.getElementById('density-val');
    if (densitySlider) densitySlider.value = initialLayers.toString();
    if (densityVal) densityVal.textContent = initialLayers.toString();

    const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
    const speedVal = document.getElementById('speed-val');
    if (speedSlider) speedSlider.value = this.config.rotSpeed.toString();
    if (speedVal) speedVal.textContent = `${this.config.rotSpeed.toFixed(1)}x`;
  }

  private setupEvents(): void {
    window.addEventListener('resize', () => this.centerContainer());

    // 1. Cambio de Color Interior SOLO desde el Botón
    const randomizeBtn = document.getElementById('randomize-btn');
    randomizeBtn?.addEventListener('click', () => {
      this.config.colorInner = ColorUtils.getRandomColor();
      this.renderer.updateColors(this.config);
    });

    // 2. Toggle de Stroke (Delineado) y Picker de Color
    const strokeBtn = document.getElementById('stroke-btn');
    const strokePicker = document.getElementById('stroke-color-picker') as HTMLInputElement;

    strokeBtn?.addEventListener('click', () => {
      this.config.stroke = !this.config.stroke;
      if (strokeBtn) {
        strokeBtn.textContent = this.config.stroke ? 'Borde: On' : 'Borde: Off';
        strokeBtn.classList.toggle('bg-indigo-600', this.config.stroke);
        strokeBtn.classList.toggle('text-white', this.config.stroke);
      }
      if (strokePicker) {
        strokePicker.disabled = !this.config.stroke;
      }
      this.renderer.rebuildPattern(this.config);
    });

    strokePicker?.addEventListener('input', () => {
      const hexStr = strokePicker.value.replace('#', '');
      this.config.strokeColor = parseInt(hexStr, 16);
      this.renderer.rebuildPattern(this.config);
    });

    // 3. Cambio de Forma
    const shapeBtns = document.querySelectorAll<HTMLButtonElement>('.shape-btn');
    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach(b => {
          b.classList.remove('bg-indigo-600', 'text-white');
          b.classList.add('text-slate-400');
        });

        btn.classList.add('bg-indigo-600', 'text-white');
        btn.classList.remove('text-slate-400');

        const shape = btn.dataset.shape as ShapeType;
        if (shape) {
          this.config.shape = shape;
          this.renderer.rebuildPattern(this.config);
        }
      });
    });

    // 4. Slider de Capas
    const densitySlider = document.getElementById('density-slider') as HTMLInputElement;
    const densityVal = document.getElementById('density-val');
    const updateDensity = () => {
      if (!densitySlider) return;
      const layers = parseInt(densitySlider.value, 10);
      this.config.step = this.config.maxSize / layers;
      if (densityVal) densityVal.textContent = layers.toString();
      this.renderer.rebuildPattern(this.config);
    };

    densitySlider?.addEventListener('input', updateDensity);
    densitySlider?.addEventListener('change', updateDensity);

    // 5. Slider de Velocidad
    const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
    const speedVal = document.getElementById('speed-val');
    const updateSpeed = () => {
      if (!speedSlider) return;
      const speed = parseFloat(speedSlider.value);
      this.config.rotSpeed = speed;
      if (speedVal) speedVal.textContent = `${speed.toFixed(1)}x`;
    };

    speedSlider?.addEventListener('input', updateSpeed);
    speedSlider?.addEventListener('change', updateSpeed);
  }
}

new ApplicationController();