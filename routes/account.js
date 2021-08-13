let user = require("../db/user");
let uuid = require("uuid");

module.exports = (app) => {
  app.get("/account/sign-up", (req, res) => {
    res.sendView("signup");
  });

  app.post("/account/sign-up", {
    schema: {
      body: {
        type: "object",
        required: ["username", "email"],
        properties: {
          username: {
            type: "string",
            pattern: "^[A-Za-z][A-Za-z0-9_]{4,15}$"
          },
          email: {
            type: "string",
            format: "email"
          }
        }
      }
    }
  }, (req, res) => {
    res.send("\"hello\"")
  });
};