import fastify from "fastify";
import fastifyStatic from "fastify-static";
import ajv from "./ajv.js";
import ejs from "./ejs.js";

console.debug("server", "Loaded dependencies");

let app = fastify();
app.setValidatorCompiler(ajv);
console.debug("fastify", "Started fastify");

app.decorate(
  "verifyEmail",
  ajv({
    type: "string",
    format: "email",
  })
);

app.decorate(
  "verifyUsername",
  ajv({
    type: "string",
    format: "username",
  })
);

app.register(fastifyStatic, {
  serve: false,
  root: process.env.ROOT,
});
console.debug("fastify", "Added Reply.sendFile");

ejs(app);
console.debug("ejs", "Loaded EJS");

app.decorate("redirect", (from, to = from + "/") => {
  app.get(from, (req, res) => res.redirect(302, to));
});

app.decorate("static", (path, to = path) => {
  app.get(`/${to}`, (req, res) => res.sendFile(`client/${path}`));
});

async function load(path) {
  let route = await import(`${process.env.ROOT}/${path}.js`);

  route.default(app);
  console.debug("server", "Loaded route " + path);
}

setImmediate(async () => {
  async function load(path) {
    await import(`${process.env.ROOT}/${path}.js`);
  }

  await load("server/socket");
  await load("routes/index");
  await load("routes/404");
  await load("routes/assets");
  await load("routes/nav");
  await load("routes/account");
  await load("server/terminal");

  app.listen(3000, "127.0.0.1");
  console.debug("fastify", "Server started");
});

export default app;
