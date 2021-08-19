module.exports = (app) => {
  app.get("/nav/", (req, res) => {
    res.sendView(
      "nav",
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
};
