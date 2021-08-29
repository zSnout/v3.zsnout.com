import bcrypt from "bcryptjs";

export function hash(text) {
  return bcrypt.hash(text, 10);
}

export function check(text) {
  return bcrypt.compare(text, hash);
}
