import evaluate from "./eval.js";
import { createInterface } from "node:readline";

let commands = {
  __proto__: null,
  clear() {
    console.clear();
    console.log("\x1b[2m\x1b[3mconsole was cleared\x1b[0m");
  },
  async exec(text) {
    await evaluate(text);
  },
  async eval(text) {
    console.log(await evaluate(text));
  },
  async notfound() {
    throw new ReferenceError("command not found");
  },
};

let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 20,
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

async function runCommand(command) {
  if (command[0] != "#" && commands[0] != ".") command = "#eval " + command;
  command = command.substr(1);
  command = command.split(" ");

  let context = commands;
  while (typeof (context = context?.[command.shift()]) == "object");

  if (typeof context != "function") context = commands.notfound;

  try {
    await context(command.join(" "));
  } catch (error) {
    console.log(`\x1b[1;31mERROR: ${error?.message || error}\x1b[0m`);
  }

  rl.query("\n> ").then(runCommand);
}

export default function (app) {
  global.app = app;

  rl.writeln();
  rl.query("> ").then(runCommand);

  rl.on("close", () => {
    console.clear();
    process.exit(0);
  });
}
