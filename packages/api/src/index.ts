import "reflect-metadata";
import { WebSocketServer } from "ws";
import { Message } from "@battle-of-intertubes/core";

const PORT = parseInt(process.env.PORT!) || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = Message.from(data.toString());
    console.log(message);
  });
});
