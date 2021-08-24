import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import decorators from "./decorators.mjs";
import ejs from "ejs";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import pointOfView from "point-of-view";
import prepareClient from "./prepare-client.mjs";
console.debug("server", "Loaded dependencies");

let ajv = new Ajv();
ajvFormats(ajv);
console.debug("ajv", "Started AJV");

let app = fastify();
app.schemaCompiler = (schema) => ajv.compile(schema);
console.debug("fastify", "Started fastify");

app.register(fastifyStatic, {
  serve: false,
  root: process.env.ROOT,
});
console.debug("fastify", "Added Reply.sendFile");

app.register(pointOfView, {
  engine: { ejs },
  options: {
    outputFunctionName: "echo",
    root: process.env.ROOT,
  },
});
console.debug("ejs", "Loaded EJS");

decorators(app);
prepareClient(app);

global.app = app;
