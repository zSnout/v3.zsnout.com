import fs from "node:fs";
import * as uuid from "uuid";

console.debug("database", "Started database");

let db;
let loc = `${process.env.ROOT}/server/database.json`;

let main = {
  protoless(k, v) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.assign(Object.create(null), v);
    }

    return v;
  },
  load() {
    db = JSON.parse(fs.readFileSync(loc, { encoding: "utf-8" }), protoless);
  },
  save() {
    let content = JSON.stringify(database);

    fs.writeFile(loc, content, () => {
      setTimeout(main.save, 15000);
    });
  },
};

class Database {
  actions = [];
  cid = null;

  insert(table, data) {
    let id = this.cid;
    if (!id) id = uuid.v4();

    this.actions.push({
      id,
      table,
      type: "insert",
      data: { ...data },
    });

    return this;
  }

  async execute() {
    for (let { id, type, data, ...action } of this.actions) {
      if (type == "update") {
        let table = db.tables[action.table];
        let meta = db.meta_tables[action.table];
        
        let row = table?.[id];

        for (let key in data) {
          if (key == "id") continue;
        }
      }
    }
  }
}

main.load();
setTimeout(main.save, 15000);

export default Database;
