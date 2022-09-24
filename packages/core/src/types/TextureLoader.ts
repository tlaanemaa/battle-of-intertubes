import { Texture } from "./Texture";

export interface TextureLoader {
  load(src: string, width?: number, height?: number): Texture;
}
