module.exports = (app) => {
  app.setNotFoundHandler(function(req, res) {
    res.code(404).sendView("404");
  });
};