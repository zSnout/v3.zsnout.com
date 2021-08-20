import "./server/console.mjs";
import dotenv from "dotenv";

console.debug("server", "Starting server");
console.debug("server", "Loading dependencies");

dotenv.config();
console.debug("dotenv", "Loaded environment variables");

import("./server/fastify.mjs");
