import app from "./app.js";
import * as ejs from "ejs";
import { FastifyReply } from "fastify";

/**
 * Escapes some XML and returns it as a string.
 * @param text The XML to escape.
 * @returns The escaped XML.
 */
function escapeXML(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Indents some text.
 * @param text The text to indent.
 * @param indent The indent to be appended to each line of the string.
 * @param first The string to be appended to the first line. Can be used if the first line is already indented.
 * @returns An indented version of the original string.
 */
function indent(text: string, indent: string, first: string = ""): string {
  let texts = String(text)
    .split("\n")
    .map((e) => indent + e);

  texts[0] = first + texts[0].substr(indent.length);

  return texts.join("\n");
}

/**
 * Renders an EJS file.
 * @param file A path to the file to be rendered, relative to the root.
 * @param data The data to be passed to the file.
 * @returns A rendered version of the EJS file.
 */
async function renderFile(file: string, data: object = {}) {
  return ejs.renderFile(file, data, { outputFunctionName: "echo" });
}

/**
 * Renders an EJS file into a complete HTML file.
 * @param file A path to the file to be rendered, relative to the project root.
 * @param data An object containing data to be passed to the EJS file.
 * @returns A rendered version of the EJS file as a complete HTML file.
 */
async function renderView(file: string, { frame = true, ...data }) {
  let layout = "";
  let title = "";
  let styles = ["/assets/index.css"];
  let preload = ["/assets/jquery.js", "/assets/underscore.js"];
  let postload = ["/assets/preindex.js", "/assets/index.js"];
  let meta: { name: string; content: string }[] = [];

  let layoutFn = (path: string) => (layout = path);
  let titleFn = (name: string) => (title = name);
  let css = styles.push.bind(styles);
  let lib = preload.push.bind(preload);
  let js = postload.push.bind(postload);
  let metaFn = (name: string, content: string) => meta.push({ name, content });

  let body = await renderFile(`client/${file}.ejs`, {
    ...data,
    data,
    escapeXML,
    indent,
    css,
    lib,
    js,
    layout: layoutFn,
    title: titleFn,
    meta: metaFn,
  });

  body = body.trim();

  if (layout) {
    body = await renderFile(`layouts/${layout}.ejs`, {
      ...data,
      data,
      body,
      escapeXML,
      indent,
      css,
      lib,
      js,
      meta: metaFn,
    });

    body = body.trim();
  }

  let resources: string[] = [];
  for (let href of styles)
    resources.push(`<link rel="stylesheet" href="${escapeXML(href)}">`);
  for (let src of preload)
    resources.push(`<script src="${escapeXML(src)}"></script>`);
  for (let src of postload)
    resources.push(`<script src="${escapeXML(src)}" type="module"></script>`);

  body = await renderFile(`layouts/index.ejs`, {
    ...data,
    data,
    frame: frame ?? false,
    body,
    title,
    resources,
    meta,
    escapeXML,
    indent,
  });

  return body.trim();
}

/**
 * Renders an EJS file into a complete HTML file, then sends it as a response.
 * @param file A path to the file to be rendered, relative to the project root.
 * @param data An object containing data to be passed to the EJS file.
 * @returns A rendered version of the EJS file as a complete HTML file.
 */
async function renderReply(this: FastifyReply, file: string, data: object) {
  this.header("Content-Type", "text/html").send(await renderView(file, data));
}

app.decorate("view", renderFile);
app.decorate("format", renderView);
app.decorateReply("view", renderReply);

export { renderFile, renderView };