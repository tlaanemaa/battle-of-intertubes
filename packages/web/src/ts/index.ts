import "reflect-metadata";
import { container } from "tsyringe";
import { Game } from "@battle-of-intertubes/game";
import { BackgroundRenderer } from "./BackgroundRenderer";
import { Canvas } from "./Canvas";
import { EntityRenderer } from "./EntityRenderer";
import { Camera } from "./Camera";
import { UserInput, INTENT } from "./UserInput";

const game = container.resolve(Game);
const camera = new Camera();
const userInput = new UserInput();
const entityCanvas = new Canvas("game-view");
const entityRenderer = new EntityRenderer(entityCanvas, camera);
const backgroundCanvas = new Canvas("game-background");
const backgroundRenderer = new BackgroundRenderer(backgroundCanvas, camera);
game.start();

userInput.on(INTENT.ZOOM_IN, () => (camera.zoom *= 1.1));
userInput.on(INTENT.ZOOM_OUT, () => (camera.zoom *= 0.9));
userInput.on(INTENT.MOVE_UP, () => (camera.position.y -= 10 / camera.zoom));
userInput.on(INTENT.MOVE_RIGHT, () => (camera.position.x += 10 / camera.zoom));
userInput.on(INTENT.MOVE_DOWN, () => (camera.position.y += 10 / camera.zoom));
userInput.on(INTENT.MOVE_LEFT, () => (camera.position.x -= 10 / camera.zoom));
userInput.on(
  INTENT.RESIZE_WINDOW,
  () => entityCanvas.resize(window.innerWidth, window.innerHeight),
  true
);
userInput.on(
  INTENT.RESIZE_WINDOW,
  () => backgroundCanvas.resize(window.innerWidth, window.innerHeight),
  true
);
userInput.on(INTENT.RESIZE_WINDOW, () =>
  backgroundRenderer.createBackgroundImage()
);

const scheduleFrame = () => {
  window.requestAnimationFrame(() => {
    try {
      const renderRadiusX = Math.round(entityCanvas.width / camera.zoom);
      const renderRadiusY = Math.round(entityCanvas.height / camera.zoom);
      const entities = game.getEntitiesForRendering(
        camera.position.x - renderRadiusX,
        camera.position.y - renderRadiusY,
        camera.position.x + renderRadiusX,
        camera.position.y + renderRadiusY
      );

      backgroundRenderer.draw();
      entityRenderer.draw(entities);
    } catch (e) {
      console.error(e);
    } finally {
      scheduleFrame();
    }
  });
};
scheduleFrame();
