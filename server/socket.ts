import app from "./app.js";
import { Server } from "socket.io";

let io = new Server(app.server);

export default io;
