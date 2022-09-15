import { FastMap } from "../primitives/FastMap";

export class TextureCache {
  private static instance?: TextureCache;
  private readonly images = new FastMap<Promise<HTMLImageElement>>();

  private constructor() {}

  public getImage(src: string) {
    const existingImage = this.images.get(src);
    if (existingImage != null) return existingImage;

    const imagePromise = new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });

    this.images.set(src, imagePromise);
    return imagePromise;
  }

  public static getInstance() {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }
}
