import "./server/console.mjs";
import dotenv from "dotenv";

console.clear();

console.debug("server", "Starting server");
console.debug("server", "Loading dependencies");

dotenv.config();
console.debug("dotenv", "Loaded environment variables");

await import("./server/fastify.mjs");
