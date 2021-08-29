import app from "./fastify.js";
import { Server } from "socket.io";

console.debug("socket.io", "Started socket.io");
let io = new Server(app.server);

export default io;
