import app from "../server/app.js";
import { extname } from "node:path";

app.setNotFoundHandler((req, res) => {
  let url = req.url;
  let hasSlash = url.substr(url.length - 1) == "/";
  let ext = extname(url);

  if (!hasSlash && ext == "") res.redirect(req.url + "/");
  else res.code(404).view("404");
});

app.setErrorHandler((err, req, res) => {
  res.send({
    error: true,
    message: err?.message,
  });
});
