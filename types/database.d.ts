export namespace Database {
  type Cols = {
    id: string;
    creation: number;
  };
  type MetaCols = string | number;

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
    pending_users: Table<TableData.PendingUsers, MetaData.PendingUsers>;
    users: Table<TableData.Users, MetaData.Users>;
  };

  namespace TableData {
    type PendingUsers = {
      id: string;
      creation: number;
      email_code: string;
      username: string;
      password: string;
      email: string;
    };

    type Users = {
      id: string;
      creation: number;
      session: string;
      username: string;
      password: string;
      email: string;
    };
  }

  namespace MetaData {
    type PendingUsers = "email_code";

    type Users = "username" | "email";
  }
}
