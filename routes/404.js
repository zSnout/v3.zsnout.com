module.exports = (app) => {
  app.setNotFoundHandler((req, res) => {
    res.code(404).sendView("404");
  });
};
