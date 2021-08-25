export default async function (app) {
  async function load(path) {
    let route = await import(`${process.env.ROOT}/${path}.js`);

    route.default(app);
    console.debug("server", "Loaded route " + path);
  }

  await load("routes/index");
  await load("routes/404");
  await load("routes/assets");
  await load("routes/nav");
  await load("routes/account");

  app.listen(3000, "127.0.0.1");
  console.debug("fastify", "Server started");

  (await import("./terminal.js")).default(app);
}
