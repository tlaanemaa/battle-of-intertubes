import { Texture, TextureLoader } from "@battle-of-intertubes/core";
import { singleton } from "tsyringe";
import { AssetCache } from "./AssetCache";

class WebTexture implements Texture {
  private readonly image = new window.Image();

  constructor(
    blobPromise: Promise<string>,
    public width: number = 10,
    public height: number = 10
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

@singleton()
export class WebTextureLoader implements TextureLoader {
  constructor(private readonly assetCache: AssetCache) {}

  load(src: string, width?: number, height?: number): Texture {
    return new WebTexture(this.assetCache.get(src), width, height);
  }
}
