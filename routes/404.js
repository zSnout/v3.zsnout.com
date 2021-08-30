import app from "../server/fastify.js";

app.setNotFoundHandler((req, res) => {
  res.view("home/404");
});

app.setErrorHandler((err, req, res) => {
  res.send({ error: true, message: err.message });
});
