export default function (app) {
  app.static("nav/index.css");
  app.static("nav/index.mjs");

  app.redirect("/nav");
  app.get("/nav/", (req, res) => {
    res.sendView(
      "nav/index",
      {
        groups: {
          Main: {
            Home: "/",
          },
        },
      },
      { frame: true }
    );
  });
}
