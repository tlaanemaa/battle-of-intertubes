import "reflect-metadata";
import { container } from "tsyringe";
import { SocketServer } from "./server/SocketServer";

container.resolve(SocketServer);
