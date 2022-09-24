import { singleton } from "tsyringe";
import { Canvas } from "../components";

@singleton()
export class BackgroundCanvas extends Canvas {
  constructor() {
    super("game-background");
  }
}
