/* old database at commit 214059f6482b02ecb18e9a7c99568a365dd18406 */

let fs = require("fs");
let db = JSON.parse(fs.readFileSync(__dirname + "/../database.json"));
console.write("database", "loaded database...");

function autosave() {
  let content = JSON.stringify(db);

  let now = Date.now();
  let size = content.length / 1024;
  size = Math.round(size * 10) / 10;
  if (size == Math.floor(size)) size = size + ".0";

  console.write("database", `saving ${size} KB to disk...`);
  fs.writeFile(__dirname + "/../database.json", content, () => {
    console.write("database", `saved after ${Date.now() - now}ms...`);

    setTimeout(autosave, 15000);
  });
}

async function get(path) {
  path = Array.isArray(path) ? path : [path];
  let obj = db;

  try {
    for (let item of path) {
      obj = obj[item];
    }

    return obj;
  } catch {
    return undefined;
  }
}

async function set(...paths) {
  let value = paths.pop();
  let path = paths.join("/").split("/");
  let last = path[path.length - 1];
  path.pop();

  let obj = db;

  try {
    for (let item of path) {
      obj = obj[item];
    }

    obj[last] = value;
  } catch {
    return undefined;
  }
}

async function has(...paths) {
  let value = paths.pop();
  let item = get(...paths);

  try {
    return value in item;
  } catch {
    return false;
  }
}

async function insert(...paths) {
  let value = paths.pop();
}

setTimeout(autosave, 15000);
module.exports = { get, set, has };
