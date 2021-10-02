import { readFile } from "node:fs/promises";
import * as ejs from "ejs";
import { FastifyReply } from "fastify";
import app from "./app.js";

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
function indent(
  text: string,
  indent: string = "  ",
  first: string = ""
): string {
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
async function renderView(file: string, data = {}) {
  let layout = "";
  let title = "";
  let buttons = [{ url: "/", icon: "home", label: "Home" }];
  let meta: { name: string; content: string }[] = [];

  let styles = ["/assets/index.css"];
  let scripts = ["/assets/zquery.js", "/assets/index.js"];

  data = { frame: false, ...data };

  let layoutFn = (path: string) => (layout = path);
  let titleFn = (name: string) => (title = name);
  let css = styles.push.bind(styles);
  let js = scripts.push.bind(scripts);
  let metaFn = (name: string, content: string) => meta.push({ name, content });
  let iconFn = (url: string, icon: string, label: string) =>
    buttons.push({ url, icon, label });

  let body = await renderFile(`client/${file}.ejs`, {
    ...data,
    data,
    escapeXML,
    indent,
    css,
    js,
    layout: layoutFn,
    title: titleFn,
    meta: metaFn,
    icon: iconFn,
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
      js,
      meta: metaFn,
      icon: iconFn,
    });

    body = body.trim();
  }

  let resources: string[] = [];
  for (let href of styles)
    resources.push(`<link rel="stylesheet" href="${escapeXML(href)}">`);
  for (let src of scripts)
    resources.push(`<script type="module" src="${escapeXML(src)}"></script>`);

  body = await renderFile(`layouts/index.ejs`, {
    ...data,
    data,
    body,
    title,
    resources,
    meta,
    escapeXML,
    indent,
    buttons: await Promise.all(
      buttons.map(async ({ url, icon, label }) => {
        return `<a href="${escapeXML(url)}" src="${escapeXML(url)}">
  <svg title="${escapeXML(label)}" viewBox="2 2 20 20">
    ${await readFile(`client/icons/${icon}.xml`)}
  </svg>
</a>`;
      })
    ),
  });

  return body.trim();
}

/**
 * Renders an EJS file into a complete HTML file, then sends it as a response.
 * @param file A path to the file to be rendered, relative to the project root.
 * @param data An object containing data to be passed to the EJS file.
 * @param frame Whether the HTML should include a navicon & navbar.
 * @returns A rendered version of the EJS file as a complete HTML file.
 */
async function renderReply(
  this: FastifyReply,
  file: string,
  data = {}
): Promise<void> {
  this.header("Content-Type", "text/html").send(await renderView(file, data));
}

/**
 * Shorthand for sending an EJS template.
 * @param route The route to expose the template on.
 * @param data Data to pass to the rendered template.
 */
function sendTemplate(route: string, data = {}) {
  app.get("/" + route, (req, res) => {
    res.view(route, data);
  });
}

/**
 * Redirects a URL to another URL.
 * @param route The original route that the request comes from.
 * @param newRoute The route to redirect requests to.
 */
function sendRedirect(route: string, newRoute: string) {
  app.get(route, (req, res) => {
    res.redirect(302, newRoute);
  });
}

app.decorate("redirect", sendRedirect);
app.decorate("template", sendTemplate);
app.decorate("view", renderFile);
app.decorate("format", renderView);
app.decorateReply("view", renderReply);

export { renderFile, renderView };
