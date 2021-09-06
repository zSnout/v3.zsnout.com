import app from "../server/app.js";

app.setNotFoundHandler((req, res) => res.code(404).view("home/404"));

app.setErrorHandler((err, req, res) => {
  res.send({ error: true, message: String(err) });
});
