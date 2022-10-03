import { singleton } from "tsyringe";
import { Entity, EntityRenderer } from "@moose-rocket/core";

@singleton()
export class ServerEntityRenderer implements EntityRenderer {
  windowWidth: number = 1000;
  windowHeight: number = 1000;

  draw(entities: Entity[]): void {}
}
