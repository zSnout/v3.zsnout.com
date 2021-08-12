let db = require("../db");
let uuid = require("uuid");

module.exports = (app) => {
  app.get("/account/log-in", (req, res) => {
    res.sendView("login");
  });

  app.get("/account/sign-up", (req, res) => {
    res.sendView("signup");
  });
};