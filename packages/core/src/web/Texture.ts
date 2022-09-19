import { AssetCache } from "./AssetCache";

export class Texture {
  private image: HTMLImageElement = new Image();
  private originalSrc?: string;
  private onload?: () => void;

  constructor(src?: string) {
    if (src) this.setImage(src);
  }

  public async setImage(src: string) {
    if (src !== this.originalSrc) {
      this.image = new Image();
      this.image.src = await AssetCache.getInstance().get(src);
      this.originalSrc = src;
      if (this.onload) this.onload();
    }
  }

  public render(): CanvasImageSource {
    return this.image;
  }
}
