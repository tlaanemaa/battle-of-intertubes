import "reflect-metadata";
import { container } from "tsyringe";
import { Game } from "@battle-of-intertubes/game";
import { BackgroundRenderer } from "./BackgroundRenderer";
import { Canvas } from "./Canvas";
import { EntityRenderer } from "./EntityRenderer";
import { Camera } from "./Camera";

const game = container.resolve(Game);
const camera = new Camera();
const entityCanvas = new Canvas("game-view");
const entityRenderer = new EntityRenderer(entityCanvas, camera);
const backgroundCanvas = new Canvas("game-background");
const backgroundRenderer = new BackgroundRenderer(backgroundCanvas, camera);
game.start();

const onResize = () => {
  entityCanvas.resize(window.innerWidth, window.innerHeight);
  backgroundCanvas.resize(window.innerWidth, window.innerHeight);
  backgroundRenderer.createBackgroundImage();
};

onResize();
window.addEventListener("resize", onResize);

window.addEventListener("wheel", (event: WheelEvent) => {
  const step = 0.1;
  if (event.deltaY > 0) camera.zoom *= 1 - step;
  if (event.deltaY < 0) camera.zoom *= 1 + step;
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  const step = 10;
  if (event.key === "ArrowUp") camera.position.y -= step;
  if (event.key === "ArrowRight") camera.position.x += step;
  if (event.key === "ArrowDown") camera.position.y += step;
  if (event.key === "ArrowLeft") camera.position.x -= step;
});

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
