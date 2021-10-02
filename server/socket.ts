import { Server } from "socket.io";
import app from "./app.js";

/** The default Socket.io instance. */
let io = new Server(app.server);

export default io;
