import { createInterface } from "node:readline";

let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 0,
});

rl.writeln = (data = "") => {
  rl.write(data + "\n");
};

rl.query = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (resp) => {
      resolve(String(resp));
    });
  });
};

async function evaluate(text) {
  try {
    console.log(await eval(text));
  } catch (error) {
    console.log(`\x1b[1;31mERROR: ${error?.message || error}\x1b[0m`);
  }

  rl.query("\n$ ").then(evaluate);
}

export default function (app) {
  rl.app = app;

  rl.writeln();
  rl.query("$ ").then(evaluate);

  rl.on("close", () => {
    console.clear();
    process.exit(0);
  });
}
