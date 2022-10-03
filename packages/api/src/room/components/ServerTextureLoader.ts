import { singleton } from "tsyringe";
import { Texture, TextureLoader } from "@moose-rocket/core";

@singleton()
export class ServerTextureLoader implements TextureLoader {
  load(
    src: string,
    width?: number | undefined,
    height?: number | undefined
  ): Texture {
    return {} as Texture;
  }
}
