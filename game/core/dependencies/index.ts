export * from "./AudioLoader";
export * from "./TextureLoader";
export * from "./Game";

export const DEPENDENCIES = {
  AudioLoader: Symbol.for("AudioLoader"),
  TextureLoader: Symbol.for("TextureLoader"),
  Game: Symbol.for("Game"),
};
