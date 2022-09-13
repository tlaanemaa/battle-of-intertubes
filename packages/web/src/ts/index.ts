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

userInput.on(INTENT.ZOOM_IN, (x) => (camera.zoom *= 1 + x / 1000));
userInput.on(INTENT.ZOOM_OUT, (x) => (camera.zoom *= 1 - x / 1000));
userInput.on(INTENT.MOVE_UP, (x) => (camera.position.y -= x / camera.zoom));
userInput.on(INTENT.MOVE_RIGHT, (x) => (camera.position.x += x / camera.zoom));
userInput.on(INTENT.MOVE_DOWN, (x) => (camera.position.y += x / camera.zoom));
userInput.on(INTENT.MOVE_LEFT, (x) => (camera.position.x -= x / camera.zoom));

const onResize = () => {
  entityCanvas.resize(window.innerWidth, window.innerHeight);
  backgroundCanvas.resize(window.innerWidth, window.innerHeight);
  backgroundRenderer.createBackgroundImage();
};
userInput.on(INTENT.RESIZE_WINDOW, onResize);
onResize();

const scheduleFrame = () =>
  window.requestAnimationFrame(() => {
    try {
      const renderRadiusX = Math.round((entityCanvas.width / camera.zoom) * 2);
      const renderRadiusY = Math.round((entityCanvas.height / camera.zoom) * 2);
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

scheduleFrame();
