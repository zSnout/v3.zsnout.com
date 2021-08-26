export default function (app) {
  app.setNotFoundHandler((req, res) => {
    res.sendView("home/404");
  });

  app.setErrorHandler((err, req, res) => {
    res.send({ error: true, message: err.message });
  });
}