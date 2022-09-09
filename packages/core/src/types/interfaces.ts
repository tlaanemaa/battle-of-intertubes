export interface Drawable {
  x: number;
  y: number;
  height: number;
  width: number;
  texture: CanvasImageSource;
  rotation: number;
  children?: Drawable[];
}

export interface Object2D {
  x: number;
  y: number;
}
