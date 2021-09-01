import app from "../server/fastify.js";

app.static("nav/index.css");
app.static("nav/index.js");

app.redirect("/nav");
app.get("/nav/", (req, res) => {
  res.view("nav/index", {
    frame: true,
    groups: {
      Main: {
        Home: "/",
      },
      Account: {
        "Log In": "/account/log-in/",
        "Sign Up": "/account/sign-up/",
      },
    },
  });
});
