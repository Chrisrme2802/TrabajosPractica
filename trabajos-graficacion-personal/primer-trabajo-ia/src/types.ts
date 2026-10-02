export type ShapeType = 'square' | 'triangle' | 'octagon' | 'circle';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface AppConfig {
  maxSize: number;
  step: number;
  rotSpeed: number;
  shape: ShapeType;
  pulseSpeed: number;
  pulseAmount: number;
  alpha: number;
  stroke: boolean;
  strokeWidth: number;
  strokeColor: number;
  colorInner: RGBColor;
  colorOuter: RGBColor;
  bgColor: number;
}