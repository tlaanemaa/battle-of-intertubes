import { TextureCache } from "./TextureCache";

export class Texture {
  private image: HTMLImageElement = new Image();
  private onload?: () => void;

  constructor(src: string) {
    this.setImage(src);
  }

  public async setImage(src: string) {
    if (src !== this.image.src) {
      this.image = await TextureCache.getInstance().getImage(src);
      if (this.onload) this.onload();
    }
  }

  public render(): CanvasImageSource {
    return this.image;
  }
}
