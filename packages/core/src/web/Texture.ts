import { AssetCache } from "./AssetCache";

export class Texture {
  private image: HTMLImageElement = new Image();
  private originalSrc?: string;
  private onload?: () => void;

  constructor(public width: number, public height: number, src?: string) {
    if (src) this.setImage(src);
  }

  public async setImage(src: string) {
    if (src !== this.originalSrc) {
      this.image = new Image();
      this.image.width = this.width;
      this.image.height = this.height;
      this.image.src = await AssetCache.getInstance().get(src);
      this.originalSrc = src;
      if (this.onload) this.onload();
    }
  }

  public render(): CanvasImageSource {
    return this.image;
  }
}
