import { existsSync, copyFileSync, readFileSync, writeFile } from "node:fs";

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
let db: {
  tables: {
    [id: string]: {
      [id: string]: object;
    };
  };
  meta_tables: {
    [tablename: string]: {
      [colname: string]: {
        [item: string]: string;
      };
    };
  };
} = JSON.parse(readFileSync("database.json", { encoding: "utf-8" }));

/** Saves the database into a JSON file. */
function save() {
  writeFile("database.json", JSON.stringify(db), () => {
    setTimeout(save, 15000);
  });
}

setTimeout(save, 15000);

let queries = {
  /**
   * Selects some data from the database.
   * @param _result The current result, which may be passed as `id` if `id` is omitted.
   * @param table The table to select data from.
   * @param id The ID of the row to select.
   * @returns An object containing the data of the row selected, or `null` if the data was not found.
   */
  select(_result: string, table: string, id: string = _result): object | null {
    if (!hasOwn(db.tables, table)) return null;
    else if (!hasOwn(db.tables[table], id)) return null;
    if (typeof db.tables[table][id] == "object") return db.tables[table][id];
    return null;
  },
};

/** A class that can be used to chain database queries to prevent them from desyncing. */
class Query {
  /** A list of actions that this query will act upon. */
  private actions: { func: () => any; args: any[] }[] = [];

  /**
   * Adds a function to the list of actions to act upon.
   * @param func The function to add to the list of actions.
   * @param args The arguments to pass to the function.
   * @returns The Query object to allow chaining.
   */
  private action(func: (...args: any[]) => any, ...args: any[]) {
    this.actions.push({ func, args });

    return this;
  }

  select(table: string, id?: string): this {
    return this.action(queries.select, table, id);
  }
}

export default Query;
