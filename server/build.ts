import glob from "glob";
import { writeFile } from "node:fs";
import { renderView } from "./ejs.js";

glob("client/**/*.ejs", (err, files) => {
  for (let file of files) {
    let now = Date.now();
    let name = file.substr("client/".length).replaceAll(".ejs", "");

    renderView(name).then((data) => {
      console.log(`${file} ${Date.now() - now}ms`);

      writeFile(file.replaceAll(".ejs", ".html"), data, () => {});
    });
  }
});

let now = Date.now();
process.on("beforeExit", () => {
  console.log("completed in " + (Date.now() - now) + "ms");
});
