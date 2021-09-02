import fs from "node:fs";
import * as uuid from "uuid";

console.debug("database", "Started database");

let db;
let loc = `${process.env.ROOT}/database.json`;

let main = {
  protoless(k, v) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.assign(Object.create(null), v);
    }

    return v;
  },
  load() {
    db = JSON.parse(
      fs.readFileSync(loc, { encoding: "utf-8" }),
      main.protoless
    );
  },
  save() {
    let content = JSON.stringify(db);

    fs.writeFile(loc, content, () => {
      setTimeout(main.save, 15000);
    });
  },
};

class Database {
  static ANS = Symbol("Database.RESULT"); // last result

  static result;
  static results = {};

  static save(name) {
    Database.results[name] = Database.result;

    return Database.result;
  }

  static load(name) {
    return Database.results[name];
  }

  static id(table, item, column) {
    return db.meta_tables[table]?.[column]?.[item] ?? null;
  }

  static has(table, item, column = "id") {
    if (column == "id") return typeof db.tables[table]?.[item] == "object";
    else return typeof db.meta_tables[table]?.[column]?.[item] == "object";
  }

  static select(a) {}

  static actions = [];

  action(func, args) {
    this.actions.push({ func, args });

    return this;
  }

  save(name) {
    return this.action(Database.save, [name]);
  }

  load(name) {
    return this.action(Database.load, [name]);
  }

  id(table, item, column) {
    return this.action(Database.id, [table, item, column]);
  }

  has(table, item, column) {
    return this.action(Database.has, [table, item, column]);
  }

  select(table, id) {
    return this.action(Database.select, [table, item, column]);
  }

  insert(table, data) {
    this.actions.push({
      table,
      id: uuid.v4(),
      type: "insert",
      data: { ...data },
    });

    return this;
  }

  update(table, id, data) {
    this.actions.push({
      table,
      id,
      type: "update",
      data: { ...data },
    });

    return this;
  }

  remove(table, id) {
    this.actions.push({
      table,
      id,
      type: "remove",
    });

    return this;
  }

  execute() {}
}

main.load();
setTimeout(main.save, 15000);

export default Database;
