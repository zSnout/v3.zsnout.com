export default function (app) {
  app.redirect("/account/sign-up");
  app.get("/account/sign-up/", (req, res) => res.sendView("account/sign-up"));
}
