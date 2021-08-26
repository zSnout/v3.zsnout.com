import fs from "node:fs/promises";
import { extname } from "node:path";
import bcrypt from "./bcrypt.js";
import database from "./database.js";
import dbclasses from "./dbclasses.js";
import "./mail.js";
import { Server } from "socket.io";

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
  bcrypt(app);

  app.decorate("database", database);
  dbclasses(app);

  let io = new Server(app.server);
  console.debug("socket.io", "Started socket.io");
  app.decorate("io", io);

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
        resources.push(
          `<script src="${escapeXML(src)}" type="module"></script>`
        );

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
}
