import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

let rl = createInterface({ input: process.stdin, output: process.stdout });
let query = (query: string) =>
  new Promise((resolve) => rl.question(query, resolve));

(async function () {
  while (true) {
    await query("");

    spawn("npm", ["run", "build"], {
      detached: true,
      stdio: "inherit",
    });
  }
})();
