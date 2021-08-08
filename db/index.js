let format = require("pg-format");

let { Client } = require("pg");
let client = new Client({
  host: "localhost",
  port: 5433,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_DB,
});

client.connect();

function idSeq(array) {
  return array.map(() => "%I").join(",");
}

function objSeq(object) {
  object = Object.entries(object);
  
  let text = object.map(() => "%I = %L");
  let values = []; object.map(([key, val]) => values.push(key, val));

  return {text, values};
}

function escape(text, ...values) {
  return format(text, ...values);
}

function query(text, ...values) {
  return client.query({ text, values });
}

function insert(table, data) {
  let keys = Object.keys(data), values = Object.values(data);
  
  let text = `INSERT INTO %I (${idSeq(keys)}) VALUES (%L)`;
  text = escape(text, table, ...keys, values);

  return query(text);
}

function select(table, columns, conditions = null) {
  if (typeof columns == "string") columns = columns.split(/, |,| /g);

  let text;
  if (conditions === null) {
    text = `SELECT ${idSeq(columns)} FROM %I`;
    text = escape(text, ...columns, table);
  } else {
    conditions = objSeq(conditions);
    
    text = `SELECT ${idSeq(columns)} FROM %I WHERE ${conditions.text.join(" AND ")}`;
    text = escape(text, ...columns, table, ...conditions.values);
  }

  return query(text);
}

function update(table, data, conditions = null) {
  conditions = objSeq(conditions);
  data = objSeq(data);

  let text = `UPDATE %I SET ${data.text.join(", ")} WHERE ${conditions.text.join(" AND ")}`;
  text = escape(text, table, ...data.values, ...conditions.values);

  return query(text);
}

function remove(table, conditions) {
  conditions = objSeq(conditions);
  
  let text = `DELETE FROM %I WHERE ${conditions.text.join(" AND ")}`;
  text = escape(text, table, ...conditions.values);

  return query(text);
}

module.exports = { escape, query, insert, select, update, remove, delete: remove };