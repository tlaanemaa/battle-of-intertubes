import { injectable } from "tsyringe";
import { StateStore } from "@battle-of-intertubes/engine";
import { Canvas } from "./Canvas";

@injectable()
export class Renderer {
  constructor(
    private readonly canvas: Canvas,
    private readonly stateStore: StateStore
  ) {}

  public draw() {
    const state = this.stateStore.getStateForRendering();
    this.canvas.clear();
    const ctx = this.canvas.getContext();
    ctx.arc(
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height,
      20,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}
