let db = require(".");
let mail = require("../mail");
let uuid = require("uuid");

class User {
  static async isNameAvailable(username) {
    if (!username.match(/^[A-Za-z_][A-Za-z0-9_]{5,}$/)) return false;
    
    if ((await db.select("users", ["id"], {username})).rows.length > 0) return false;
    if ((await db.select("pending_users", ["id"], {username})).rows.length > 0) return false;

    return true;
  }

  static async createPendingUser(username, email) {
    if (!(await User.isNameAvailable(username))) return false;
    
    let emailCode = uuid.v4();
    await db.insert("pending_users", {
      id: uuid.v4(),
      creation: Date.now(),
      username: username,
      email: email,
      email_code: emailCode
    });

    await mail.send({
      to: email,
      subject: "Verify your zSnout account!",
      text: `You're almost done setting up your zSnout account, @${username}! Just go to https://localhost/account/verify/${emailCode} to begin your adventure on zSnout!\n\nDidn't sign up for a zSnout account? You might have recieved this email by mistake. Go to https://localhost/account/unverify/${emailCode} to remove your email from zSnout.`
    });

    return true;
  }

  static async verifyPendingUser(username, password, emailCode) {
    let data = await db.select("pending_users", "email email_code", { username });

    if (data.rows.length == 0) {
      return false;
    } else if (data.rows[0].email_code == emailCode) {
      let id = data.rows[0].id;

      await db.delete("pending_users", { username });
      
      await db.insert("users", {
        id: uuid.v4(),
        creation: Date.now(),
        username,
        password,
        session: uuid.v4(),
        email: data.rows[0].email,
      });
    } else return false;
  }
}

module.exports = User;