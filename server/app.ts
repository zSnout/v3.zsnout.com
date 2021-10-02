import { ServerResponse } from "node:http";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import { formats } from "./ajv.js";

/** The main Fastify app. */
let app = fastify({
  ajv: {
    customOptions: { formats },
  },
});

app.register(fastifyStatic, {
  root: dirname(fileURLToPath(import.meta.url)) + "/../client/",
  setHeaders(res: ServerResponse, path: string) {
    if (path.substring(path.length - 3) == ".ts")
      res.setHeader("content-type", "text/typescript");
    else if (path.substring(path.length - 4) == ".ejs")
      res.setHeader("content-type", "text/html");
  },
});

export default app;
