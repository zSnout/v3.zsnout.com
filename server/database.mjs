import fs from "node:fs";

let database = JSON.parse(
  fs.readFileSync(process.env.ROOT + "/resources/database.json", {
    encoding: "utf-8",
  })
);

function save() {
  fs.writeFile(
    process.env.ROOT + "/resources/database.json",
    JSON.stringify(database, null, "  ")
  );
}

export default { raw: database };
