export interface Texture {
  width: number;
  height: number;
  render(): CanvasImageSource;
}
