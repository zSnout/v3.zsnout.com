import { readFile } from "node:fs/promises";
import app from "../server/app.js";

app.get("/assets/react.js", (req, res) => {
  res.header("content-type", "text/javascript");

  return readFile("./node_modules/react/umd/react.production.min.js", {
    encoding: "utf-8",
  });
});

app.get("/assets/react-dom.js", (req, res) => {
  res.header("content-type", "text/javascript");

  return readFile("./node_modules/react-dom/umd/react-dom.production.min.js", {
    encoding: "utf-8",
  });
});
