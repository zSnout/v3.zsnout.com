export default function (app) {
  app.static("assets/favicon.ico", "favicon.ico");
  app.static("assets/index.css");
  app.static("assets/index.mjs");
  app.static("assets/jquery.js");
  app.static("assets/preindex.mjs");
  app.static("assets/underscore.js");
}
