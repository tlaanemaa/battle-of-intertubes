import {
  Camera,
  Canvas,
  GameRunner,
  UserInput,
  INTENT,
} from "@battle-of-intertubes/core";
import { EntityStore } from "@battle-of-intertubes/core/src/store/EntityStore";
import { Moose } from "../entities/Moose";
import { Player } from "../entities/Player";

export class Game {
  private readonly entityCanvas = new Canvas("game-view");
  private readonly backgroundCanvas = new Canvas("game-background");
  private readonly camera = Camera.getInstance();
  private readonly store = new EntityStore();
  private readonly userInput = new UserInput();
  private readonly player = new Player(this.camera);
  private readonly gameRunner = new GameRunner(
    this.backgroundCanvas,
    this.entityCanvas,
    this.camera,
    this.store
  );

  init() {
    this.store.add(this.player);
    const spaceFactor = 3;
    const count = 1000;
    const entities = new Array(count).fill(1).map(() => {
      const entity = new Moose(
        Math.round(
          Math.random() * count * spaceFactor * 2 - count * spaceFactor
        ),
        Math.round(
          Math.random() * count * spaceFactor * 2 - count * spaceFactor
        )
      );

      this.store.add(entity);
      return entity;
    });

    this.userInput.on(INTENT.ZOOM_IN, (x) => {
      this.camera.zoom *= 1 + x / 1000;
    });
    this.userInput.on(INTENT.ZOOM_OUT, (x) => {
      this.camera.zoom *= 1 - x / 1000;
    });

    this.userInput.on(INTENT.MOVE_UP, (x) => {
      this.player.applyForce({ x: 0, y: -x * this.player.mass * 10 });
    });
    this.userInput.on(INTENT.MOVE_RIGHT, (x) => {
      this.player.applyForce({ x: x * this.player.mass * 10, y: 0 });
    });
    this.userInput.on(INTENT.MOVE_DOWN, (x) => {
      this.player.applyForce({ x: 0, y: x * this.player.mass * 10 });
    });
    this.userInput.on(INTENT.MOVE_LEFT, (x) => {
      this.player.applyForce({ x: -x * this.player.mass * 10, y: 0 });
    });

    this.gameRunner.start();
  }
}
