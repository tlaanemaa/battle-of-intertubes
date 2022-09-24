import { Entity } from "../components";

export interface EntityRenderer {
  windowWidth: number;
  windowHeight: number;
  draw(entities: Entity[]): void;
}
