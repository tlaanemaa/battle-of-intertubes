import { container } from "@/game/container";
import { Application } from "./Application";

export const startGameUI = () => {
  const app = container.get(Application);
};
