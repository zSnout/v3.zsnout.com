import Ajv from "ajv";

console.debug("ajv", "Started AJV");
let ajv = new Ajv({
  formats: {
    username: /^[A-Za-z_][A-Za-z0-9_]{4,15}$/,
    password: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
    email:
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
});

function compile(schema) {
  if ("schema" in schema) {
    return ajv.compile(schema.schema).bind(ajv);
  } else return ajv.compile(schema).bind(ajv);
}

export default compile;
