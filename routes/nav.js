module.exports = (app) => {
  app.get("/nav/", (req, res) => {
    res.sendView("nav", {}, false);
  });
};