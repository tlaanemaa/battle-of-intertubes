import "reflect-metadata";
import { container } from "tsyringe";
import { Game } from "@battle-of-intertubes/game";

const game = new Game();

game.init();
