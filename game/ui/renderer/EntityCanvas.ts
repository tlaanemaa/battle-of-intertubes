import { container } from "@/game/container";
import { injectable } from "inversify";
import { Canvas } from "../components";

@injectable()
export class EntityCanvas extends Canvas {
  constructor() {
    super("game-view");
  }
}

container.bind(EntityCanvas).toSelf().inSingletonScope();
