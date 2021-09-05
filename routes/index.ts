import app from "../server/app.js";

app.get("/", (req, res) => {
  res.view("home/index");
});
