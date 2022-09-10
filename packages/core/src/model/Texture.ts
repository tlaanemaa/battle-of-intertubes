import { FastMap } from "./FastMap";

class TextureCache {
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

  public static get() {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }
}

export class Texture {
  private image: HTMLImageElement = new Image();

  constructor(src: string) {
    this.setImage(src);
  }

  public async setImage(src: string) {
    if (src !== this.image.src) {
      this.image = await TextureCache.get().getImage(src);
    }
  }

  public render(): CanvasImageSource {
    return this.image;
  }
}
