import app from "./app.js";
import { Server } from "socket.io";

/** The default Socket.io instance. */
let io = new Server(app.server);

export default io;
