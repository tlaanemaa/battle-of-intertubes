import { injectable } from "inversify";
import { DEPENDENCIES, Texture, TextureLoader } from "@/game/core";
import { AssetCache } from "./AssetCache";
import { container } from "@/game/container";

class WebTexture implements Texture {
  private readonly image = new window.Image();

  constructor(
    blobPromise: Promise<string>,
    public width: number = 10,
    public height: number = 10,
  ) {
    blobPromise.then((src) => {
      this.image.src = src;
    });
    this.image.width = width;
    this.image.height = height;
  }

  render() {
    return this.image;
  }
}

@injectable()
export class WebTextureLoader implements TextureLoader {
  constructor(private readonly assetCache: AssetCache) {}

  load(src: string, width?: number, height?: number): Texture {
    return new WebTexture(this.assetCache.get(src), width, height);
  }
}

container
  .bind(DEPENDENCIES.TextureLoader)
  .to(WebTextureLoader)
  .inSingletonScope();
