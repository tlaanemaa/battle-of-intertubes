import { singleton } from "tsyringe";
import { Audio, AudioLoader } from "@moose-rocket/core";
import { AssetCache } from "./AssetCache";

class WebAudio implements Audio {
  constructor(private readonly blobPromise: Promise<string>) {}

  async play() {
    const blob = await this.blobPromise;
    new window.Audio(blob).play();
  }
}

@singleton()
export class WebAudioLoader implements AudioLoader {
  constructor(private readonly assetCache: AssetCache) {}

  public load(src: string): Audio {
    return new WebAudio(this.assetCache.get(src));
  }
}
