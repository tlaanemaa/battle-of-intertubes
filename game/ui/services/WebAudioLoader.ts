import { injectable } from "inversify";
import { Audio, AudioLoader, DEPENDENCIES } from "@/game/core";
import { AssetCache } from "./AssetCache";
import { container } from "@/game/container";

class WebAudio implements Audio {
  constructor(private readonly blobPromise: Promise<string>) { }

  async play() {
    const blob = await this.blobPromise;
    try {
      const audio = new window.Audio(blob)
      audio.volume = 0.2;
      await audio.play();
    } catch (e) {
      // Hide audio errors in the browser
    }
  }
}

@injectable()
export class WebAudioLoader implements AudioLoader {
  constructor(private readonly assetCache: AssetCache) { }

  public load(src: string): Audio {
    return new WebAudio(this.assetCache.get(src));
  }
}

container.bind(DEPENDENCIES.AudioLoader).to(WebAudioLoader).inSingletonScope();
