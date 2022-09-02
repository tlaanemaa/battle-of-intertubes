import "reflect-metadata";
import { container } from "tsyringe";
import { Renderer } from "./Renderer";

const renderer = container.resolve(Renderer);
const scheduleFrame = () => {
  window.requestAnimationFrame(() => {
    try {
      renderer.draw();
    } catch (e) {
      console.error(e);
    } finally {
      scheduleFrame();
    }
  });
};
scheduleFrame();
