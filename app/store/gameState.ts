import { create } from "zustand";
import { Entity } from "@/game/core";
import { startGameUI } from "@/game/ui";

type Store = {
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
};

export const useGameState = create<Store>()((set) => ({
  entities: [],
  setEntities: (entities) => set(() => ({ entities })),
}));

startGameUI(useGameState.getState().setEntities);
