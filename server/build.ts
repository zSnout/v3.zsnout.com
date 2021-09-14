import glob from "glob";
import { writeFile } from "node:fs";
import { renderView } from "./ejs.js";

glob("client/**/*.ejs", (err, files) => {
  for (let file of files) {
    let name = file.substr("client/".length).replaceAll(".ejs", "");

    renderView(name).then((data) => {
      writeFile(file.replaceAll(".ejs", ".html"), data, () => {});

      console.log("rendered " + name);
    });
  }
});
