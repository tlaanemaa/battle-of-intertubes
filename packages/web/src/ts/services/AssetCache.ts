import { singleton } from "tsyringe";
import { FastMap } from "@battle-of-intertubes/core";

@singleton()
export class AssetCache {
  private readonly assets = new FastMap<Promise<string>>();

  public get(src: string) {
    const cachedAsset = this.assets.get(src);
    if (cachedAsset) return cachedAsset;

    const loadedAsset = this.loadAsset(src);
    this.assets.set(src, loadedAsset);
    return loadedAsset;
  }

  private async loadAsset(src: string): Promise<string> {
    const blob = await fetch(new Request(src)).then((response) =>
      response.blob()
    );
    return URL.createObjectURL(blob);
  }
}
