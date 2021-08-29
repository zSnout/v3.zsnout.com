import app from "../server/fastify.js";

app.static("assets/favicon.ico", "favicon.ico");
app.static("assets/index.css");
app.static("assets/index.js");
app.static("assets/jquery.js");
app.static("assets/preindex.js");
app.static("assets/underscore.js");
app.static("assets/form.css");
