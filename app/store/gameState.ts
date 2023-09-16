import { create } from "zustand";
import { Entity } from "@/game/core";
import { startGameUI } from "@/game/ui";

type Coordinates2d = {
  x: number;
  y: number;
};

type GameState = {
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
  cameraPosition: { x: number; y: number };
  setCameraPosition: (cameraPosition: Coordinates2d) => void;
};

export const useGameState = create<GameState>()((set) => ({
  entities: [],
  setEntities: (entities) => set(() => ({ entities })),

  cameraPosition: { x: 0, y: 0 },
  setCameraPosition: (cameraPosition) => set(() => ({ cameraPosition })),
}));

startGameUI(
  useGameState.getState().setEntities,
  useGameState.getState().setCameraPosition
);
