import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Audio, AudioLoader } from "@moose-rocket/core";

@injectable()
export class ServerAudioLoader implements AudioLoader {
  load(src: string): Audio {
    return {
      play() {},
    };
  }
}

container.bind(ServerAudioLoader).toSelf().inSingletonScope();
