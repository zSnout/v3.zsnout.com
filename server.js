require("dotenv").config();

const app = require("fastify").fastify();

const escapeXML = (text) => {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const indent = (text, indent) => {
  return String(text)
    .split("\n")
    .map(e => indent + e)
    .join("\n");
};

app.register(require("fastify-static"), {
  root: __dirname + "/public"
});

app.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs")
  },
  options: {
    outputFunctionName: "echo",
    root: "/home/zsakowitz",
  }
});

app.decorate("load", async function (path) {
  require(__dirname + `/routes/${path}`)(app);
});

app.decorateReply("sendView", async function (view, data = {}, navicon = true) {
  let layout = null;
  let title = "";
  let styles = ["/index.css"];
  let preload = ["/jquery.js", "/index.js"];
  let postload = ["/index.mjs"];
  let meta = [];
  let info = {};

  let body = await app.view(`views/${view}.ejs`, {
    ...data, data, info, escapeXML, indent,
    layout: (path) => layout = path,
    title: (name) => title = name,
    css: (href) => styles.push(href),
    js: (src) => postload.push(src),
    lib: (src) => preload.push(src),
    meta: (name, content) => meta.push({name, content}),
  });

  body = body.trimStart();

  if (layout) {
    body = await app.view(`layouts/${layout}.ejs`, {
      ...info, data: info, body, escapeXML, indent,
      title: (name) => title = name,
      css: (href) => styles.push(href),
      js: (src) => postload.push(src),
      lib: (src) => preload.push(src),
      meta: (name, content) => meta.push({name, content}),
    });
    
    body = body.trimStart();
  }

  let resources = [];
  for (let href of styles) resources.push(`<link rel="stylesheet" href="${escapeXML(href)}">`);
  for (let src of preload) resources.push(`<script src="${escapeXML(src)}"></script>`);
  for (let src of postload) resources.push(`<script src="${escapeXML(src)}" type="module"></script>`);
  
  await this.view(`layout.ejs`, { body, title, resources, meta, navicon, escapeXML, indent });
});

app.load("index");
app.load("nav");
app.load("404");

app.listen(3000, "127.0.0.1");
console.log("app has started on port 3000");