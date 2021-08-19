export default function (app) {
  async function load(dir) {
    let route = await import(`${process.env.ROOT}/${dir}/route.mjs`);

    route(app, (path) => {
      app.get(`/${dir}/${path}`, (_, res) => {
        res.sendFile(`${process.env.ROOT}/${dir}/${path}`);
      });
    });
  }

  setImmediate(() => app.listen(3000, "127.0.0.1"));
}
