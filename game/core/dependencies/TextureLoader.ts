export interface Texture {
  width: number;
  height: number;
  render(): CanvasImageSource;
}

export interface TextureLoader {
  load(src: string, width?: number, height?: number): Texture;
}
