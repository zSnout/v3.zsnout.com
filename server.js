{
  let now = Date.now();

  console.write = (name, message) => {
    let diff = Date.now() - now;

    if (diff < 1000) {
      diff = ("00" + diff).substr(-3) + "m";
    } else if (diff < 1000000) {
      if (diff < 10000) diff = Math.round(diff / 100) / 10;
      else if (diff < 100000) diff = Math.round(diff / 100) / 10;
      else diff = Math.round(diff / 1000);

      if (diff < 1000) {
        diff = String(diff);
        let hasDot = diff.indexOf(".") > -1;

        if (diff.length == 1) diff = diff + ".00";
        else if (diff.length == 2 && hasDot) diff = diff + "00";
        else if (diff.length == 2) diff = diff + ".0";
        else if (diff.length == 3 && hasDot) diff = diff + "0";
        else if (diff.length == 3) diff = "0" + diff;
      }
    } else {
      diff = Math.floor(diff / 1000);
    }

    console.log(`<${name}> at ${diff}s: ${message}`);
  }
}

console.write("server", "booting up...");

require("dotenv").config();

const app = require("fastify").fastify({
  // https: {
  //   cert: require("fs").readFileSync(__dirname + "/cert.pem"),
  //   key: require("fs").readFileSync(__dirname + "/key.pem"),
  // }
});

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

  console.write("server", "loaded " + path);
});

app.decorateReply("sendView", async function (view, data = {}, {frame = false} = {}) {
  let layout = null;
  let title = "";
  let styles = ["/assets/index.css"];
  let preload = ["/assets/jquery.js", "/assets/underscore.js"];
  let postload = ["/assets/preindex.mjs", "/assets/index.mjs"];
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
  
  await this.view(`layout.ejs`, { body, title, resources, meta, frame, escapeXML, indent });
});

console.write("server", "fastify loaded...");

app.load("index");
app.load("nav");
app.load("account");
app.load("404");

app.listen(3000, "127.0.0.1");

console.write("server", "started on port 3000");