import { inject, injectable } from "inversify";
import { container } from "@/game/container";
import { Camera, DEPENDENCIES, GameRunner } from "@/game/core";
import type { Game } from "@/game/core";
import { PlayerFactory } from "@/game/game";
import "./components";
import "./renderer";
import "./services";
import { WebControls } from "./services/WebControls";
import { BackgroundRenderer, EntityRenderer } from "./renderer";
import { ServerConnection } from "./services";
import { AnyMessage } from "@/game/messaging";

@injectable()
export class Application {
  // private readonly serverConnection = new ServerConnection(
  //   "ws://localhost:8080",
  //   this.handleServerMessage.bind(this)
  // );

  constructor(
    private readonly camera: Camera,
    private readonly playerFactory: PlayerFactory,
    private readonly webControls: WebControls,
    private readonly gameRunner: GameRunner,
    private readonly backgroundRenderer: BackgroundRenderer,
    private readonly entityRenderer: EntityRenderer,
    @inject(DEPENDENCIES.Game) private readonly game: Game
  ) {
    this.render = this.render.bind(this);
    const player = this.playerFactory.get();
    this.webControls.target = player.id;
    this.game.addPlayer(player);
    this.game.init();
    window.requestAnimationFrame(this.render);
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

container.bind(Application).toSelf().inSingletonScope();
