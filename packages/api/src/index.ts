import "reflect-metadata";
import { container } from "tsyringe";
import "@battle-of-intertubes/game";
import { SocketServer } from "./server/SocketServer";

container.resolve(SocketServer);
