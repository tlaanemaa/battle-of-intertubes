import { injectable } from "inversify";
import { Camera, Entity } from "../components";
import { EntityStore } from "./EntityStore";
import { Collider } from "../tools";
import { container } from "@moose-rocket/container";
import { Clock } from "./Clock";

@injectable()
export class GameRunner {
  public entities2Render: Entity[] = [];

  constructor(
    private readonly clock: Clock,
    private readonly camera: Camera,
    private readonly store: EntityStore
  ) {
    this.clock.schedulePrimary(() => this.tick());
  }

  public start() {
    this.clock.start();
  }

  public stop() {
    this.clock.stop();
  }

  private tick() {
    const entities = this.store.getArea(
      this.camera.position.x - this.camera.viewRadius.x,
      this.camera.position.y - this.camera.viewRadius.y,
      this.camera.position.x + this.camera.viewRadius.x,
      this.camera.position.y + this.camera.viewRadius.y
    );

    const collider = new Collider(entities);
    collider.calculate();

    this.entities2Render = entities;
  }

  public patchState(entities: Entity[]) {
    entities.forEach((entity) => {
      const storedEntity = this.store.getByID(entity.id);
      if (!storedEntity) {
        this.store.add(entity);
      } else {
        Object.assign(storedEntity, entity);
      }
    });
  }
}

container.bind(GameRunner).toSelf().inSingletonScope();
