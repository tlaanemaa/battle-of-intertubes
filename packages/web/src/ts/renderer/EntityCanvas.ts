import { singleton } from "tsyringe";
import { Canvas } from "../components/Canvas";

@singleton()
export class EntityCanvas extends Canvas {
  constructor() {
    super("game-view");
  }
}
