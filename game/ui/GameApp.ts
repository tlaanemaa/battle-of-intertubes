import { inject, injectable } from "inversify";
import { container } from "@/game/container";
import { Camera, DEPENDENCIES, GameRunner, UserInput } from "@/game/core";
import type { Game, INTENT } from "@/game/core";
import { Player, PlayerFactory } from "@/game/game";
import "./components";
import "./renderer";
import "./services";
import { BackgroundRenderer, EntityRenderer } from "./renderer";
import { ServerConnection } from "./services";
import { AnyMessage } from "@/game/messaging";

@injectable()
export class GameApp {
  private gameStarted = false;
  public readonly player: Player
  // private readonly serverConnection = new ServerConnection(
  //   "ws://localhost:8080",
  //   this.handleServerMessage.bind(this)
  // );

  constructor(
    private readonly camera: Camera,
    private readonly playerFactory: PlayerFactory,
    private readonly userInput: UserInput,
    private readonly gameRunner: GameRunner,
    private readonly backgroundRenderer: BackgroundRenderer,
    private readonly entityRenderer: EntityRenderer,
    @inject(DEPENDENCIES.Game) private readonly game: Game
  ) {
    this.render = this.render.bind(this);
    this.player = this.playerFactory.get();
    this.game.addPlayer(this.player);
  }

  public start() {
    if (this.gameStarted) {
      console.error("Game already started");
      return;
    }
    this.gameStarted = true;
    this.game.init();
    window.requestAnimationFrame(this.render);
  }

  public sendPlayerInput(intent: INTENT) {
    this.userInput.trigger(this.player.id, intent);
  }

  private render() {
    const entities = this.gameRunner.entities2Render;
    this.backgroundRenderer.draw();
    this.entityRenderer.draw(entities);
    window.requestAnimationFrame(this.render);

    this.camera.viewRadius = {
      x: Math.round(this.entityRenderer.windowWidth / this.camera.zoom),
      y: Math.round(this.entityRenderer.windowHeight / this.camera.zoom),
    };
  }

  private handleServerMessage(message: AnyMessage) {
    console.log("Received state", message);
    if (message.type === "state-update") {
      this.gameRunner.patchState(message.entities);
    }
  }
}

container.bind(GameApp).toSelf().inSingletonScope();
