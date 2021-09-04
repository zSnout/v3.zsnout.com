type DBCols = {
  id: string;
  creation: number;
};

type DBMetaCols = string | number;

type DBTable<Data extends DBCols, MetaCols extends DBMetaCols> = {
  data: {
    [id: string]: Data;
  };
  meta: {
    [K in MetaCols]: { [x: string]: string };
  };
};

export type DBPendingUsers = {
  id: string;
  creation: number;
  email_code: string;
  username: string;
  password: string;
  email: string;
};

export type DBUsers = {
  id: string;
  creation: number;
  session: string;
  username: string;
  password: string;
  email: string;
};

export type DBRows = {
  pending_users: DBTable<DBPendingUsers, "email_code">;
  users: DBTable<DBUsers, "username" | "email">;
};

export type DB = {
  tables: DBRows;
};
