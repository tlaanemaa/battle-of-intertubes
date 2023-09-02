import { injectable } from "inversify";
import { container } from "@/game/container";
import { Canvas } from "../components";

@injectable()
export class BackgroundCanvas extends Canvas {
  constructor() {
    super("game-background");
  }
}

container.bind(BackgroundCanvas).toSelf().inSingletonScope();
