import { inject, injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { DEPENDENCIES, Game, GameRunner, UserInput } from "@moose-rocket/core";
import { PlayerFactory, Player } from "@moose-rocket/game";
import "./components";
import { ActionPerformedMessage } from "@moose-rocket/messaging";

@injectable()
export class Application {
  private playerMap = new Map<string, Player>();

  constructor(
    private readonly playerFactory: PlayerFactory,
    private readonly gameRunner: GameRunner,
    private readonly userInput: UserInput,
    @inject(DEPENDENCIES.Game) private readonly game: Game
  ) {
    const player = this.playerFactory.get();

    this.game.addPlayer(player);
    this.game.init();
  }

  createPlayer(id: string) {
    const player = this.playerFactory.get();
    this.playerMap.set(id, player);
    this.game.addPlayer(player);
  }

  onPlayerAction(target: string, message: ActionPerformedMessage) {
    const player = this.playerMap.get(target);
    if (!player) return;
    message.actions.forEach((intent) =>
      this.userInput.trigger(player.id, intent)
    );
  }

  removePlayer(id: string) {
    const player = this.playerFactory.get();
    if (!player) return;
    this.playerMap.delete(id);
    this.game.removePlayer(player);
  }

  public getState() {
    return this.gameRunner.entities2Render;
  }
}

container.bind(Application).toSelf().inSingletonScope();
