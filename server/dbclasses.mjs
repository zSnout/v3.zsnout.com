import * as uuid from "uuid";
import { send } from "./mail.mjs";

export default function (app) {
  let db = app.database;

  class PendingUser {
    static async create(email, username) {
      let emailCode = uuid.v4();
      let displayName = username;
      username = username.toLowerCase();

      if (!app.verifyEmail(email) || !app.verifyUsername(username))
        return false;

      if (
        (await db.has("pending_users", "username", username)) ||
        (await db.has("pending_users", "email", email)) ||
        (await db.has("users", "username", username)) ||
        (await db.has("users", "email", email))
      )
        return false;

      await db.insert("pending_users", {
        email,
        username,
        display_name: displayName,
        email_code: emailCode,
      });

      await send({
        to: email,
        subject: "Verify your account on zSnout!",
        text: `Welcome to zSnout! Click this link to verify your account: ${process.env.HOST}/account/verify/${emailCode}`,
      });

      return true;
    }

    static async verify(code, password) {
      let user = await db.select("pending_users", code, "email_code");
      if (!user) return false;

      await db.remove("pending_users", user.id);
      await db.insert("users", {
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        password: await app.hash(password),
        session: uuid.v4(),
      });

      return true;
    }
  }

  class User {}

  db.PendingUser = PendingUser;
  db.User = User;
}
