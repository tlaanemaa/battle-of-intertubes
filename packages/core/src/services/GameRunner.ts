import { inject, injectable } from "inversify";
import { Camera } from "../components";
import { EntityStore } from "./EntityStore";
import { Collider } from "../tools";
import { DEPENDENCIES, Timer } from "../dependencies";
import { EntityRenderer, BackgroundRenderer } from "../dependencies";
import { container } from "@moose-rocket/container";

@injectable()
export class GameRunner {
  constructor(
    @inject(DEPENDENCIES.BackgroundRenderer)
    private readonly backgroundRenderer: BackgroundRenderer,
    @inject(DEPENDENCIES.EntityRenderer)
    private readonly entityRenderer: EntityRenderer,
    @inject(DEPENDENCIES.Timer)
    private readonly timer: Timer,
    private readonly camera: Camera,
    private readonly store: EntityStore
  ) {
    this.timer.schedulePrimary(() => this.tick());
  }

  public start() {
    this.timer.start();
  }

  public stop() {
    this.timer.stop();
  }

  private tick() {
    const renderRadiusX = Math.round(
      this.entityRenderer.windowWidth / this.camera.zoom
    );
    const renderRadiusY = Math.round(
      this.entityRenderer.windowHeight / this.camera.zoom
    );

    const entities = this.store.getArea(
      this.camera.position.x - renderRadiusX,
      this.camera.position.y - renderRadiusY,
      this.camera.position.x + renderRadiusX,
      this.camera.position.y + renderRadiusY
    );

    const collider = new Collider(entities);
    collider.calculate();

    this.backgroundRenderer.draw();
    this.entityRenderer.draw(entities);
  }
}

container.bind(GameRunner).toSelf().inSingletonScope();
