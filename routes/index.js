module.exports = (app) => {
  app.get("/", (req, res) => {
    return res.use("index");
  });
};