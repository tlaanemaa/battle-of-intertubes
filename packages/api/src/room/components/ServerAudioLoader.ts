import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Audio, AudioLoader, DEPENDENCIES } from "@moose-rocket/core";

@injectable()
export class ServerAudioLoader implements AudioLoader {
  load(src: string): Audio {
    return {
      play() {},
    };
  }
}

container
  .bind(DEPENDENCIES.AudioLoader)
  .to(ServerAudioLoader)
  .inSingletonScope();
