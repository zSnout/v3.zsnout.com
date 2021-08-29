setImmediate(async () => {
  async function load(path) {
    await import(`${process.env.ROOT}/${path}.js`);
  }

  await load("routes/index");
  await load("routes/404");
  await load("routes/assets");
  await load("routes/nav");
  await load("routes/account");

  app.listen(3000, "127.0.0.1");
  console.debug("fastify", "Server started");

  (await import("./terminal.js")).default(app);
});
