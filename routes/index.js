export default function (app) {
  app.get("/", (req, res) => {
    res.sendView("home/index");
  });
}
