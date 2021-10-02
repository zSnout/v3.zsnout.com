/** A list of formats that can be used for JSON schemas. */
let formats: { readonly [K in "username" | "password" | "email"]: RegExp } = {
  username: /^[A-Za-z_][A-Za-z0-9_]{4,15}$/,
  password: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
  email:
    /^[a-zA-Z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
};

export { formats };
