import { FastMap } from "./FastMap";

export class Texture {
  private static readonly images = new FastMap<HTMLImageElement>();
  
  private readonly image: HTMLImageElement;

  private static createImage(src: string) {
    const img = this.images.get(src);
    if (img) return img;

    const newImage = new Image();
    newImage.src = src;
    this.images.set(src, newImage);
    return newImage;
  }

  constructor(src: string) {
    this.image = Texture.createImage(src);
  }

  public render(): CanvasImageSource {
    return this.image;
  }
}
