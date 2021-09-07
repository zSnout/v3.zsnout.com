import { dirname } from "path";
import { fileURLToPath } from "url";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import { formats } from "./ajv.js";
import { ServerResponse } from "http";

/** The main Fastify app. */
let app = fastify({
  ajv: {
    customOptions: { formats },
  },
});

/** Register fastify-static. */
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
