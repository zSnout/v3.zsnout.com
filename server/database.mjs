import fs from "node:fs";
import * as uuid from "uuid";

const TABLE_PREFIX = "";
let database = JSON.parse(
  fs.readFileSync(process.env.ROOT + "/server/database.json", {
    encoding: "utf-8",
  })
);

function save() {
  let content = JSON.stringify(database, null, "  ");

  fs.writeFile(process.env.ROOT + "/server/database.json", content, () => {
    setTimeout(save, 15000);
  });
}
setTimeout(save, 15000);

async function get(path) {
  try {
    if (typeof path == "string") path = path.split(".");

    let obj = database;
    let item;
    while ((item = path.shift()) && obj[item]) obj = obj[item];

    return obj;
  } catch {}
}

async function set(path, val) {
  try {
    if (typeof path == "string") path = path.split(".");

    let last = path.pop();
    let item = await get(path);

    item[last] = val;
  } catch {}
}

async function select(tablename, id, row = "id", out = "_") {
  try {
    let { data, ...table } = await get(TABLE_PREFIX + tablename);

    if (row == null) row = "id";
    if (row != "id") {
      let map = table[`_${row}`];

      if (typeof id == "string") id = map?.[id];
      else id = [...id].map((e) => map?.[e]);
    }

    if (typeof id == "string") {
      let val = JSON.parse(JSON.stringify(data[id] ?? null));

      if (out == "_") return val;
      else return val[out];
    } else {
      let rows = {};

      if (out == "_") for (let uid of id) rows[uid] = data[id] ?? null;
      else for (let uid of id) rows[uid] = data[id]?.[out] ?? null;

      return JSON.parse(JSON.stringify(rows));
    }
  } catch {}
}

async function insert(tablename, data) {
  try {
    data = JSON.parse(JSON.stringify(data));

    let table = await get(TABLE_PREFIX + tablename);
    data.id = uuid.v4();

    for (let map in table) {
      if (map.startsWith("_")) {
        let key = map.substr(1);

        if (key in data) table[map][data[key]] = data.id;
      }
    }

    table.data[data.id] = data;

    return data.id;
  } catch {
    return null;
  }
}

async function update(tablename, id, data) {
  try {
    data = JSON.parse(JSON.stringify(data));

    let table = await get(TABLE_PREFIX + tablename);
    delete data.id;

    for (let map in table) {
      if (map.startsWith("_")) {
        let key = map.substr(1);

        if (key in data) table[map][data[key]] = id;
      }
    }

    for (let key in data) table.data[id][key] = data[key];

    return id;
  } catch {
    return null;
  }
}

async function remove(tablename, id) {
  try {
    let table = await get(TABLE_PREFIX + tablename);

    if (id in table.data) {
      let row = table.data[id];
      delete table.data[id];

      for (let key in row)
        if (`_${key}` in table) delete table[`_${key}`][row[key]];
    }
  } catch {}
}

console.debug("database", "Started database");
export default { select, insert, update, remove };
