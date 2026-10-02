import type { RGBColor } from './types';

export class ColorUtils {
  static lerpColor(c1: RGBColor, c2: RGBColor, amt: number): RGBColor {
    const clamp = Math.max(0, Math.min(1, amt));
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * clamp),
      g: Math.round(c1.g + (c2.g - c1.g) * clamp),
      b: Math.round(c1.b + (c2.b - c1.b) * clamp)
    };
  }

  static rgbToHex(color: RGBColor): number {
    return (color.r << 16) + (color.g << 8) + color.b;
  }

  static getRandomColor(): RGBColor {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }
}