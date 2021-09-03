import { existsSync, copyFileSync, readFileSync, writeFile } from "node:fs";

if (!existsSync("database.json")) {
  copyFileSync("database-template.json", "database.json");
}

let db: {
  tables: { [id: string]: object };
  meta_tables: {
    [tablename: string]: { [colname: string]: { [item: string]: string } };
  };
} = JSON.parse(readFileSync("database.json", { encoding: "utf-8" }));

function save() {
  writeFile("database.json", JSON.stringify(db), () => {
    setTimeout(save, 15000);
  });
}

setTimeout(save, 15000);

let database = {};
