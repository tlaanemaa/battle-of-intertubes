import { container } from "@/game/container";
import { Application } from "./Application";
import { Entity } from "../core";

export const startGameUI = (
  updateState: (entities: Entity[]) => void,
  setCameraPosition: (position: { x: number; y: number }) => void
) => {
  container.get(Application).init(updateState, setCameraPosition);
};
