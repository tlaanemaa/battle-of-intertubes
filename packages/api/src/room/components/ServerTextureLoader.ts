import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { Texture, TextureLoader } from "@moose-rocket/core";

@injectable()
export class ServerTextureLoader implements TextureLoader {
  load(
    src: string,
    width?: number | undefined,
    height?: number | undefined
  ): Texture {
    return {} as Texture;
  }
}

container.bind(ServerTextureLoader).toSelf().inSingletonScope();
