import { container, Lifecycle } from "tsyringe";
import { MooseGame } from "./services";

container.register(
  "Game",
  { useClass: MooseGame },
  { lifecycle: Lifecycle.Singleton }
);

export { MooseGame };
