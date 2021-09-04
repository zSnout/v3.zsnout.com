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
  /**
   * Gets the ID of a row in the database based on another piece of data.
   * @param table The table to get the ID from.
   * @param col The column to use as the key.
   * @param item The key that maps to the ID.
   * @returns A string containing the ID of the database row, or `null` if the key doesn't exist.
   */
  id<T extends keyof Database.Tables, K extends keyof Database.MetaData<T>>(
    table: T,
    col: K,
    item: string
  ): string | null {
    let metas = database.tables[table].meta as Database.MetaData<T>;
    let meta = metas[col] as unknown as Database.MetaRow;

    return meta[item] ?? null;
  },

  /**
   * Checks if an item exists within a table.
   * @param table The table to check within.
   * @param col The column to use as the key.
   * @param item The item in the database.
   * @returns A boolean indicating whether `item` exists within the column `col`.
   */
  has<T extends keyof Database.Tables, K extends keyof Database.MetaData<T>>(
    table: T,
    col: K,
    item: string
  ) {
    let metas = database.tables[table].meta as Database.MetaData<T>;
    let meta = metas[col] as unknown as Database.MetaRow;

    return hasOwn(meta, item);
  },

  /**
   * Selects some data from the database.
   * @param table The table to select from.
   * @param id The ID of the row to select from.
   * @returns The row with ID `id`, or `null` if the ID doesn't exist.
   */
  select<T extends keyof Database.Tables>(table: T, id: string) {
    let data = database.tables[table].data;

    if (hasOwn(data, id)) return data[id] as Database.TableData<T>;
    else return null;
  },
};

export default Query;
