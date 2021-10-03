export namespace Database {
  type Cols = {
    readonly id: string;
    readonly creation: number;
    last_update: number;
  };
  type MetaCols = string;

  type Rows<T extends Cols> = { [id: string]: T };
  type MetaRows<T extends MetaCols> = { [K in T]: MetaRow };
  type MetaRow = { [x: string]: string };

  type Table<T extends Cols, K extends MetaCols> = {
    data: Rows<T>;
    meta: MetaRows<K>;
  };

  type DB = {
    tables: Tables;
  };

  type Tables = {
    pending_users: Table<
      TableData.PendingUsers,
      "email_code" | "username" | "email"
    >;
    users: Table<TableData.Users, "session" | "username" | "email">;
  };

  type TableData<T extends keyof Database.Tables> =
    Database.Tables[T]["data"][string];

  type WritableTableData<T extends keyof Database.Tables> = Omit<
    Database.TableData<T>,
    "id" | "creation"
  >;

  type MetaData<T extends keyof Database.Tables> = Database.Tables[T]["meta"];

  namespace TableData {
    type PendingUsers = {
      readonly id: string;
      readonly creation: number;
      last_update: number;
      email_code: string;
      username: string;
      password: string;
      email: string;
    };

    type Users = {
      readonly id: string;
      readonly creation: number;
      last_update: number;
      session: string;
      username: string;
      password: string;
      email: string;
    };
  }
}
