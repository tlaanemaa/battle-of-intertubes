import { injectable } from "tsyringe";
import { Camera } from "../components/Camera";
import { BackgroundRenderer } from "../renderer/BackgroundRenderer";
import { EntityRenderer } from "../renderer/EntityRenderer";
import { Canvas } from "../web/Canvas";
import { EntityStore } from "../store/EntityStore";
import { FrameTimer } from "../web/FrameTimer";
import { Collider } from "../tools/Collider";

@injectable()
export class GameRunner {
  private readonly backgroundRenderer: BackgroundRenderer;
  private readonly entityRenderer: EntityRenderer;

  constructor(
    private readonly backgroundCanvas: Canvas,
    private readonly entityCanvas: Canvas,
    private readonly camera: Camera,
    private readonly store: EntityStore,
    private readonly timer: FrameTimer
  ) {
    this.backgroundRenderer = new BackgroundRenderer(
      this.backgroundCanvas,
      this.camera
    );
    this.timer.schedule(() => this.tick());
    this.entityRenderer = new EntityRenderer(this.entityCanvas, this.camera);

    // TODO: This should probably be somewhere else
    const onResize = () => {
      entityCanvas.resize(window.innerWidth, window.innerHeight);
      backgroundCanvas.resize(window.innerWidth, window.innerHeight);
      this.backgroundRenderer.createBackgroundImage();
    };
    window.addEventListener("resize", onResize);
    onResize();
  }

  public start() {
    this.timer.start();
  }

  public stop() {
    this.timer.stop();
  }

  private tick() {
    const renderRadiusX = Math.round(
      this.entityCanvas.width / this.camera.zoom
    );
    const renderRadiusY = Math.round(
      this.entityCanvas.height / this.camera.zoom
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
