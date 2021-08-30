import app from "../server/fastify.js";

app.static("account/sign-up.js", "account/sign-up/index.js");

app.redirect("/account/sign-up");
app.get("/account/sign-up/", (req, res) => res.view("account/sign-up"));
app.post(
  "/account/sign-up/",
  {
    schema: {
      body: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          username: {
            type: "string",
            format: "username",
          },
          password: {
            type: "string",
            minLength: 8,
            format: "password",
          },
        },
        required: ["username", "email", "password"],
      },
    },
  },
  (req, res) => {}
);
