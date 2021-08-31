import ejs from "ejs";

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

export default function (app) {
  app.decorate("view", async (file, data) => {
    return await ejs.renderFile(file, data, { outputFunctionName: "echo" });
  });

  app.decorate("format", async (file, { frame = false, ...data } = {}) => {
    let layout = null;
    let title = "";
    let styles = ["/assets/index.css"];
    let preload = ["/assets/jquery.js", "/assets/underscore.js"];
    let postload = ["/assets/preindex.js", "/assets/index.js"];
    let meta = [];
    let info = {};

    let body = await app.view(`client/${file}.ejs`, {
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

    return await app.view(`layouts/index.ejs`, {
      body,
      title,
      resources,
      meta,
      frame,
      escapeXML,
      indent,
    });
  });

  app.decorateReply("view", async function (file, data) {
    let content = await app.format(file, data);

    this.header("content-type", "text/html").send(content);
  });
}
