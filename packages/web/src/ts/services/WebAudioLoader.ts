import { injectable } from "inversify";
import { Audio, AudioLoader, DEPENDENCIES } from "@moose-rocket/core";
import { AssetCache } from "./AssetCache";
import { container } from "@moose-rocket/container";

class WebAudio implements Audio {
  constructor(private readonly blobPromise: Promise<string>) {}

  async play() {
    const blob = await this.blobPromise;
    new window.Audio(blob).play();
  }
}

@injectable()
export class WebAudioLoader implements AudioLoader {
  constructor(private readonly assetCache: AssetCache) {}

  public load(src: string): Audio {
    return new WebAudio(this.assetCache.get(src));
  }
}

container.bind(DEPENDENCIES.AudioLoader).to(WebAudioLoader).inSingletonScope();
