import bcrypt from "./bcrypt.mjs";
import database from "./database.mjs";
import { Server } from "socket.io";

function escapeXML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function indent(text, indent) {
  return String(text)
    .split("\n")
    .map((e) => indent + e)
    .join("\n");
}

export default function (app) {
  app.decorate("bcrypt", bcrypt);
  app.decorate("database", database);
  app.decorate("db", database);

  let io = new Server(app.server);
  app.decorate("io", io);

  app.decorate("static", (path, to = path) => {
    app.get(`/${to}`, (req, res) =>
      res.sendFile(`${process.env.ROOT}/client/${to}`)
    );
  });

  app.decorateReply(
    "sendView",
    async function (view, data = {}, { frame = false } = {}) {
      let layout = null;
      let title = "";
      let styles = ["/assets/index.css"];
      let preload = ["/assets/jquery.js", "/assets/underscore.js"];
      let postload = ["/assets/preindex.mjs", "/assets/index.mjs"];
      let meta = [];
      let info = {};

      let body = await app.view(`views/${view}.ejs`, {
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

      body = body.trimStart();

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

        body = body.trimStart();
      }

      let resources = [];
      for (let href of styles)
        resources.push(`<link rel="stylesheet" href="${escapeXML(href)}">`);
      for (let src of preload)
        resources.push(`<script src="${escapeXML(src)}"></script>`);
      for (let src of postload)
        resources.push(
          `<script src="${escapeXML(src)}" type="module"></script>`
        );

      await this.view(`layout.ejs`, {
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
}
