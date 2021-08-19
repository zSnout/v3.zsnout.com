export default function (app) {
  async function load(dir) {
    let route = await import(`${process.env.ROOT}/${dir}/ROUTE.mjs`);

    route(app);
  }

  await load("assets");
  setImmediate(() => app.listen(3000, "127.0.0.1"));
}
