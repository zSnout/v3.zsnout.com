import "./server/console.js";
import dotenv from "dotenv";

console.clear();

console.debug("server", "Starting server");
console.debug("server", "Loading dependencies");

dotenv.config();
console.debug("dotenv", "Loaded environment variables");

import("./server/fastify.js");
