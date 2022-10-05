export * from "./AudioLoader";
export * from "./BackgroundRenderer";
export * from "./EntityRenderer";
export * from "./TextureLoader";
export * from "./Timer";
export * from "./UserInput";
export * from "./Game";

export const DEPENDENCIES = {
  AudioLoader: Symbol.for("AudioLoader"),
  BackgroundRenderer: Symbol.for("BackgroundRenderer"),
  EntityRenderer: Symbol.for("EntityRenderer"),
  TextureLoader: Symbol.for("TextureLoader"),
  Timer: Symbol.for("Timer"),
  UserInput: Symbol.for("UserInput"),
  Game: Symbol.for("Game"),
};
