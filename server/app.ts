import fastify from "fastify";
import { formats } from "./ajv.js";

/** The main Fastify app. */
let app = fastify({
  ajv: {
    customOptions: { formats },
  },
});
export default app;
