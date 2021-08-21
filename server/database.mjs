import fs from "node:fs";

let database = JSON.parse(
  fs.readFileSync(process.env.ROOT + "/resources/database.json", {
    encoding: "utf-8",
  })
);
console.debug("database", "Started database");

function save() {
  let content = JSON.stringify(database, null, "  ");

  fs.writeFile(process.env.ROOT + "/resources/database.json", content, () => {
    setTimeout(save, 15000);
  });
}
setTimeout(save, 15000);

export default { raw: database };
