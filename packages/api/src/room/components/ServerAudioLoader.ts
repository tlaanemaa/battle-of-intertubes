import { singleton } from "tsyringe";
import { Audio, AudioLoader } from "@moose-rocket/core";

@singleton()
export class ServerAudioLoader implements AudioLoader {
  load(src: string): Audio {
    return {
      play() {},
    };
  }
}
