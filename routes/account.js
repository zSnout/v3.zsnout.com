export default function (app) {
  app.static("account/sign-up.js", "account/sign-up/index.js");

  app.redirect("/account/sign-up");
  app.get("/account/sign-up/", (req, res) => res.sendView("account/sign-up"));
}
