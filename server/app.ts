import fastify from "fastify";
import fastifyStatic from "fastify-static";
import { formats } from "./ajv.js";

/** The main Fastify app. */
let app = fastify({
  ajv: {
    customOptions: { formats },
  },
});

app.register(fastifyStatic, {
  root: "/",
  serve: false,
});

export default app;
