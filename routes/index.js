import app from "../server/fastify.js";

app.get("/", (req, res) => {
  res.view("home/index");
});
