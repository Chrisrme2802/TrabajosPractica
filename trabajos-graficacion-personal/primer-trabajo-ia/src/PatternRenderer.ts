import * as PIXI from 'pixi.js';
import type { AppConfig, ShapeType } from './types';
import { ColorUtils } from './ColorUtils';

export class PatternRenderer {
  public container: PIXI.Container;
  private graphicsList: PIXI.Graphics[] = [];

  constructor() {
    this.container = new PIXI.Container();
  }

  public rebuildPattern(config: AppConfig): void {
    this.container.removeChildren();
    this.graphicsList = [];

    for (let i = config.maxSize; i > 0; i -= config.step) {
      const amt = 1 - (i / config.maxSize);
      const blendedColor = ColorUtils.lerpColor(config.colorInner, config.colorOuter, amt);
      const hexColor = ColorUtils.rgbToHex(blendedColor);

      const g = new PIXI.Graphics();
      this.drawShape(g, config.shape, i);

      if (config.stroke) {
        g.stroke({ width: config.strokeWidth, color: config.strokeColor, alpha: 0.8 });
      }

      g.fill({ color: hexColor, alpha: config.alpha });

      this.container.addChild(g);
      this.graphicsList.push(g);
    }
  }

  public updateColors(config: AppConfig): void {
    const total = this.graphicsList.length;

    this.graphicsList.forEach((g, idx) => {
      const amt = idx / total;
      const blendedColor = ColorUtils.lerpColor(config.colorInner, config.colorOuter, amt);
      const hexColor = ColorUtils.rgbToHex(blendedColor);
      g.tint = hexColor;
    });
  }

  public updateRotations(rotSpeed: number): void {
    this.graphicsList.forEach((g, idx) => {
      g.rotation += (idx + 1) * rotSpeed * 0.0001;
    });
  }

  private drawShape(g: PIXI.Graphics, shape: ShapeType, size: number): void {
    const half = size / 2;

    switch (shape) {
      case 'square':
        g.rect(-half, -half, size, size);
        break;

      case 'circle':
        g.circle(0, 0, half);
        break;

      case 'triangle': {
        const height = (Math.sqrt(3) / 2) * size;
        g.poly([
          0, -height / 2,
          -half, height / 2,
          half, height / 2
        ]);
        break;
      }

      case 'octagon': {
        const a = size / (1 + Math.SQRT2);
        const b = a / Math.SQRT2;
        g.poly([
          -a / 2, -half,
           a / 2, -half,
           half, -b,
           half,  b,
           a / 2,  half,
          -a / 2,  half,
          -half,  b,
          -half, -b
        ]);
        break;
      }
    }
  }
}