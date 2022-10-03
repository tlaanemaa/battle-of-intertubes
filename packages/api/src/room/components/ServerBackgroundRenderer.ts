import { singleton } from "tsyringe";
import { BackgroundRenderer } from "@moose-rocket/core";

@singleton()
export class ServerBackgroundRenderer implements BackgroundRenderer {
  draw(): void {}
}
