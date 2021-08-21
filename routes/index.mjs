export default function (app) {
  app.setNotFoundHandler((req, res) => {
    res.sendView("home/404");
  });
}
