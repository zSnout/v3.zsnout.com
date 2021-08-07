module.exports = function(app) {
  app.setNotFoundHandler(function(req, res) {
    res.code(404).send("oops 404");
  });
};