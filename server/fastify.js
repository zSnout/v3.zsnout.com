import Ajv from "ajv";
import decorators from "./decorators.js";
import ejs from "ejs";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import pointOfView from "point-of-view";
import prepareClient from "./prepare-client.js";
console.debug("server", "Loaded dependencies");

let ajv = new Ajv({
  formats: {
    username: /^[A-Za-z_][A-Za-z0-9_]{4,15}$/,
    password: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
    email:
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
});
console.debug("ajv", "Started AJV");

let app = fastify();
app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
console.debug("fastify", "Started fastify");

app.verifyEmail = ajv.compile({ type: "string", format: "email" }).bind(ajv);

app.verifyUsername = ajv
  .compile({
    type: "string",
    format: "username",
  })
  .bind(ajv);

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
