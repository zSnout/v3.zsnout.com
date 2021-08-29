import app from "../server/fastify.js";

app.get("/", (req, res) => {
  res.sendView("home/index");
});
