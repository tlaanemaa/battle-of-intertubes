import { singleton } from "tsyringe";
import { Canvas } from "../components";

@singleton()
export class EntityCanvas extends Canvas {
  constructor() {
    super("game-view");
  }
}
