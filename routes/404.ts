import app from "../server/app.js";

app.setNotFoundHandler((req, res) => res.code(404).view("404"));

app.setErrorHandler((err, req, res) => {
  res.send({
    error: true,
    message: err?.message,
  });
});
