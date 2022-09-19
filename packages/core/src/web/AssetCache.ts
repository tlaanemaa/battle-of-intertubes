import { FastMap } from "../primitives/FastMap";

export class AssetCache {
  private static instance?: AssetCache;
  private readonly assets = new FastMap<Promise<string>>();

  private constructor() {}

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

  public static getInstance() {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }
}
