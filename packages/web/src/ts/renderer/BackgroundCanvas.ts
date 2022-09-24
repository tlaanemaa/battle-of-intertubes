import { singleton } from "tsyringe";
import { Canvas } from "../components/Canvas";

@singleton()
export class BackgroundCanvas extends Canvas {
  constructor() {
    super("game-background");
  }
}
