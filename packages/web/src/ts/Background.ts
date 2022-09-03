import { Object2D } from "@battle-of-intertubes/engine";
import { singleton } from "tsyringe";

@singleton()
export class Background {
  private readonly imageSize = 400;
  private readonly element = document.getElementById(
    "game-background"
  ) as HTMLDivElement;

  public setPosition(position: Object2D, zoomModifier: number) {
    const x = position.x % this.imageSize;
    const y = position.y % this.imageSize;
    this.setSize(zoomModifier);
    this.element.style.transform = `translate(${x}px, ${y}px) scale(${zoomModifier})`;
  }

  private setSize(zoomModifier: number) {
    const scale = 1 / zoomModifier;
    this.element.style.top = `${-this.imageSize * 1.1 * scale}px`;
    this.element.style.left = `${-this.imageSize * 1.1 * scale}px`;
    this.element.style.bottom = `${-this.imageSize * 1.1 * scale}px`;
    this.element.style.right = `${-this.imageSize * 1.1 * scale}px`;
  }
}
