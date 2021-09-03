import * as bcrypt from "bcryptjs";

// import bcrypt from "bcryptjs";

export function hash(text: string) {
  return bcrypt.hash(text, 10);
}

export function check(text: string, hash: string) {
  return bcrypt.compare(text, hash);
}
