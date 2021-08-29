import fs from "node:fs";
import * as uuid from "uuid";

let db = { select, insert, update, remove, has };
console.debug("database", "Started database");

function protoless(k, v) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return Object.assign(Object.create(null), v);
  }

  return v;
}

const TABLE_PREFIX = "";
let database = JSON.parse(
  fs.readFileSync(process.env.ROOT + "/server/database.json", {
    encoding: "utf-8",
  }),
  protoless
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
      let val = data[id] ?? null;

      if (out == "_") return val;
      else return val?.[out];
    } else {
      let rows = {};

      if (out == "_") for (let uid of id) rows[uid] = data[id] ?? null;
      else for (let uid of id) rows[uid] = data[id]?.[out] ?? null;

      return rows;
    }
  } catch {}
}

async function insert(tablename, data) {
  try {
    let table = await get(TABLE_PREFIX + tablename);

    data = { ...data, id: uuid.v4(), creation: Date.now() };

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
    let table = await get(TABLE_PREFIX + tablename);

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

async function has(tablename, row, item) {
  try {
    let table = await get(TABLE_PREFIX + tablename);
    table = table[`_${row}`];

    if (Object.keys(table).includes(item)) return true;
    else return false;
  } catch {
    return false;
  }
}

class PendingUser {
  static async create(email, username, password) {
    let emailCode = uuid.v4();
    let displayName = username;
    username = username.toLowerCase();

    if (!app.verifyEmail(email) || !app.verifyUsername(username)) return false;

    if (
      (await db.has("pending_users", "username", username)) ||
      (await db.has("pending_users", "email", email)) ||
      (await db.has("users", "username", username)) ||
      (await db.has("users", "email", email))
    )
      return false;

    await db.insert("pending_users", {
      email,
      username,
      display_name: displayName,
      email_code: emailCode,
    });

    return true;
  }

  static async verify(code, password) {
    let user = await db.select("pending_users", code, "email_code");
    if (!user) return false;

    await db.remove("pending_users", user.id);
    await db.insert("users", {
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      password: await app.hash(password),
      session: uuid.v4(),
    });

    return true;
  }
}

class User {}

export { select, insert, update, remove, has, PendingUser, User };
