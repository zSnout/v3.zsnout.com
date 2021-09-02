import Ajv, { Format, SchemaObject } from "ajv";

let formats: { [x: string]: Format } = {
  username: /^[A-Za-z_][A-Za-z0-9_]{4,15}$/,
  password: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
  email:
    /^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
};

let ajv = new Ajv({ formats });

function compile(schema: SchemaObject) {
  return ajv.compile(schema);
}

export { compile, formats, ajv };
