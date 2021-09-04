import { existsSync, copyFileSync, readFileSync, writeFile } from "node:fs";
import { Database } from "../types/database";

if (!existsSync("database.json")) {
  copyFileSync("database-template.json", "database.json");
}

/**
 * Checks if a property is in an object.
 * @param object The object to check in.
 * @param key The property to check for.
 * @returns A boolean indicating whether `key` is in `object`.
 */
function hasOwn(obj: object, key: string | symbol | number): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** The original database as a JSON file. */
let database: Database.DB = JSON.parse(
  readFileSync("database.json", { encoding: "utf-8" })
);

/** Saves the database into a JSON file. */
function save() {
  writeFile("database.json", JSON.stringify(database), () => {
    setTimeout(save, 15000);
  });
}

setTimeout(save, 15000);

/** A namespace that contains functions that work with the database. */
let Query = {
  id<T extends keyof Database.Tables, K extends keyof Database.MetaData<T>>(
    table: T,
    col: K,
    item: string
  ): string | null {
    let metas = database.tables[table].meta as Database.MetaData<T>;
    let meta = metas[col] as unknown as Database.MetaRow;

    return meta[item] ?? null;
  },

  select<T extends keyof Database.Tables>(table: T, id: string) {
    return database.tables[table].data[id] as Database.TableData<T>;
  },
};

let a = Query.id("users", "username", "def");

export default Query;
