import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { DEPENDENCIES, Texture, TextureLoader } from "@moose-rocket/core";

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

container
  .bind(DEPENDENCIES.TextureLoader)
  .to(ServerTextureLoader)
  .inSingletonScope();
