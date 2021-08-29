import ejs from "ejs";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import pointOfView from "point-of-view";
import ajv from "./ajv.js";

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

app.register(pointOfView, {
  engine: { ejs },
  options: {
    outputFunctionName: "echo",
    root: process.env.ROOT,
  },
});
console.debug("ejs", "Loaded EJS");

function escapeXML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function indent(text, indent, first = "") {
  if (first === true) first = indent;

  text = String(text)
    .split("\n")
    .map((e) => indent + e);

  text[0] = first + text[0].substr(indent.length);

  return text.join("\n");
}

app.decorate("redirect", (from, to = from + "/") => {
  app.get(from, (req, res) => res.redirect(302, to));
});

app.decorate("static", (path, to = path) => {
  app.get(`/${to}`, (req, res) => res.sendFile(`client/${path}`));
});

app.decorateReply(
  "sendView",
  async function (view, data = {}, { frame = false } = {}) {
    let layout = null;
    let title = "";
    let styles = ["/assets/index.css"];
    let preload = ["/assets/jquery.js", "/assets/underscore.js"];
    let postload = ["/assets/preindex.js", "/assets/index.js"];
    let meta = [];
    let info = {};

    let body = await app.view(`client/${view}.ejs`, {
      ...data,
      data,
      info,
      escapeXML,
      indent,
      layout: (path) => (layout = path),
      title: (name) => (title = name),
      css: (href) => styles.push(href),
      js: (src) => postload.push(src),
      lib: (src) => preload.push(src),
      meta: (name, content) => meta.push({ name, content }),
    });

    body = body.trim();

    if (layout) {
      body = await app.view(`layouts/${layout}.ejs`, {
        ...info,
        data: info,
        body,
        escapeXML,
        indent,
        title: (name) => (title = name),
        css: (href) => styles.push(href),
        js: (src) => postload.push(src),
        lib: (src) => preload.push(src),
        meta: (name, content) => meta.push({ name, content }),
      });

      body = body.trim();
    }

    let resources = [];

    for (let href of styles)
      resources.push(`<link rel="stylesheet" href="${escapeXML(href)}">`);

    for (let src of preload)
      resources.push(`<script src="${escapeXML(src)}"></script>`);

    for (let src of postload)
      resources.push(`<script src="${escapeXML(src)}" type="module"></script>`);

    await this.view(`layouts/index.ejs`, {
      body,
      title,
      resources,
      meta,
      frame,
      escapeXML,
      indent,
    });
  }
);

async function load(path) {
  let route = await import(`${process.env.ROOT}/${path}.js`);

  route.default(app);
  console.debug("server", "Loaded route " + path);
}

import("./prepare-client.js");

export default app;
