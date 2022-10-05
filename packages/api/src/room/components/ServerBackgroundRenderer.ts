import { injectable } from "inversify";
import { container } from "@moose-rocket/container";
import { BackgroundRenderer } from "@moose-rocket/core";

@injectable()
export class ServerBackgroundRenderer implements BackgroundRenderer {
  draw(): void {}
}

container.bind(ServerBackgroundRenderer).toSelf().inSingletonScope();
