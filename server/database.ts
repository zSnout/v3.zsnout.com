import { randomUUID } from "node:crypto";
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
class Query {
  /**
   * Gets the ID of a row in the database based on another piece of data.
   * @param table The table to get the ID from.
   * @param col The column to use as the key.
   * @param item The key that maps to the ID.
   * @returns A promise resolving with a string containing the ID of the database row, or `null` if the key doesn't exist.
   */
  static async id<
    T extends keyof Database.Tables,
    K extends keyof Database.MetaData<T>
  >(table: T, col: K, item: string): Promise<string | null> {
    let metas = database.tables[table].meta as Database.MetaData<T>;
    let meta = metas[col] as unknown as Database.MetaRow;

    return meta[item] ?? null;
  }

  /**
   * Checks if an item exists within a table.
   * @param table The table to check within.
   * @param col The column to use as the key.
   * @param item The item in the database.
   * @returns A promise resolving with a boolean indicating whether `item` exists within the column `col`.
   */
  static async has<
    T extends keyof Database.Tables,
    K extends keyof Database.MetaData<T>
  >(table: T, col: K, item: string): Promise<boolean> {
    let metas = database.tables[table].meta as Database.MetaData<T>;
    let meta = metas[col] as unknown as Database.MetaRow;

    return hasOwn(meta, item);
  }

  /**
   * Selects some data from the database.
   * @param table The table to select from.
   * @param id The ID of the row to select from.
   * @returns A promise resolving with the row with ID `id`, or `null` if the ID doesn't exist.
   */
  static async select<T extends keyof Database.Tables>(table: T, id: string) {
    let data = database.tables[table].data;

    if (hasOwn(data, id)) return data[id] as Database.TableData<T>;
    else return null;
  }

  /**
   * Inserts some data into the database.
   * @param table The table to insert data into.
   * @param obj The data to insert into the table.
   * @returns A promise resolving once the operation is complete.
   */
  static async insert<T extends keyof Database.Tables>(
    table: T,
    obj: Database.WritableTableData<T>
  ): Promise<void> {
    let data = database.tables[table];
    let row: Database.TableData<T> = {
      ...obj,
      id: randomUUID(),
      creation: Date.now(),
    } as Database.TableData<T>;

    data.data[row.id] = row;

    let meta = data.meta as unknown as Database.MetaData<T>;

    for (let key in meta) {
      let metaRow = meta[key];

      // @ts-ignore
      metaRow[row[key]] = row.id;
    }
  }

  /**
   * Updates a row in the database.
   * @param table The table to update.
   * @param id The ID of the row to update.
   * @param obj The data to update with.
   * @returns A promise resolving once the operation is complete.
   */
  static async update<T extends keyof Database.Tables>(
    table: T,
    id: string,
    obj: Database.WritableTableData<T>
  ): Promise<void> {
    let data = database.tables[table];

    if (!hasOwn(data.data, id)) return;

    let old = data.data[id];
    let meta = data.meta as unknown as Database.MetaData<T>;

    for (let key in meta) {
      let metaRow = meta[key];

      if (hasOwn(obj, key)) {
        // @ts-ignore
        delete metaRow[old[key]];

        // @ts-ignore
        metaRow[obj[key]] = id;
      }
    }

    data.data[id] = { ...old, ...obj, last_update: Date.now() };
  }

  /**
   * Removes a row from the database.
   * @param table The table to remove the data from.
   * @param id The ID of the row to remove.
   * @returns A promise resolving once the operation is complete.
   */
  static async remove<T extends keyof Database.Tables>(table: T, id: string) {
    let data = database.tables[table];

    if (!hasOwn(data.data, id)) return;

    let old = data.data[id];
    let meta = data.meta as unknown as Database.MetaData<T>;

    for (let key in meta) {
      let metaRow = meta[key];

      // @ts-ignore
      delete metaRow[old[key]];
    }

    delete data.data[id];
  }
}

export default Query;
