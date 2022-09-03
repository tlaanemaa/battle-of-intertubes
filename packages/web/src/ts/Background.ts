import { Object2D } from "@battle-of-intertubes/engine";
import { singleton } from "tsyringe";

@singleton()
export class Background {
  private readonly size = 400;
  private readonly element = document.getElementById(
    "game-background"
  ) as HTMLDivElement;

  public setPosition(position: Object2D, zoomModifier: number) {
    const x = position.x % this.size;
    const y = position.y % this.size;
    this.element.style.transform = `translate(${x}px, ${y}px) scale(${zoomModifier})`;
  }
}
