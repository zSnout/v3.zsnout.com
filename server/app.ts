import fastify from "fastify";
import { formats } from "./ajv.js";

export default fastify({
  ajv: {
    customOptions: { formats },
  },
});
