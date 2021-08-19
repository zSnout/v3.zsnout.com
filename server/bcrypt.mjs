import bcrypt from "bcryptjs";

export default function (app) {
  app.decorate("hash", (text) => bcrypt.hash(text, 10));
  app.decorate("check", (text, hash) => bcrypt.compare(text, hash));
}
