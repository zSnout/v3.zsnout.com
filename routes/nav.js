export default function (app) {
  app.static("nav/index.css");
  app.static("nav/index.js");

  app.redirect("/nav");
  app.get("/nav/", (req, res) => {
    res.sendView(
      "nav/index",
      {
        groups: {
          Main: {
            Home: "/",
          },
          Account: {
            "Log In": "/account/log-in/",
            "Sign Up": "/account/sign-up/",
          },
        },
      },
      { frame: true }
    );
  });
}
