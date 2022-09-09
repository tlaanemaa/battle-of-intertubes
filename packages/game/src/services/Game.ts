import { singleton } from "tsyringe";
import { EntityStore } from "@battle-of-intertubes/core";

@singleton()
export class Game {
  constructor(private readonly store: EntityStore) {}
}
