import Ajv from "ajv";
import ajvFormats from "ajv-formats";
import fastify from "fastify";
import ejs from "ejs";
import pointOfView from "point-of-view";
import prepareClient from "./prepare-client";
import decorators from "./decorators";

let ajv = new Ajv();
ajvFormats(ajv);

let app = fastify();
app.schemaCompiler = (schema) => ajv.compile(schema);

app.register(pointOfView, {
  engine: { ejs },
  options: {
    outputFunctionName: "echo",
    root: process.env.ROOT,
  },
});

app.register(decorators);
app.register(prepareClient);

export default app;
