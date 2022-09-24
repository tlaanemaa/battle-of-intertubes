import "reflect-metadata";
import { container } from "tsyringe";
import "@battle-of-intertubes/game";
import { SocketServer } from "./services/SocketServer";

container.resolve(SocketServer);
