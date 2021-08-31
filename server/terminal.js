import app from "./fastify.js";
import evaluate from "./eval.js";
import { createInterface } from "node:readline";

function toString(_, item) {
  if (typeof item == "function") {
    item = item.toString().split("\n")[0];
    item = item.substr(0, item.length - 1).trim();
  }

  return item;
}

let commands = {
  __proto__: null,
  clear() {
    rl.clear();
    rl.writeln("\x1b[2m\x1b[3mconsole was cleared\x1b[0m");
  },
  async exec(text) {
    await evaluate(text);
  },
  async eval(text) {
    let content = await evaluate(text);

    try {
      content = JSON.stringify(content, toString, "  ");
    } catch {
      throw new Error("return value was not jsonable");
    }

    rl.writeln(content);
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

rl.clear = console.clear.bind(console);

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
  if (command[0] != "#" && command[0] != ".") command = "#eval " + command;
  command = command.substr(1);
  command = command.split(" ");

  let context = commands;
  while (typeof (context = context?.[command.shift()]) == "object");

  if (typeof context != "function") context = commands.notfound;

  try {
    await context(command.join(" "));
  } catch (error) {
    rl.writeln(
      `\x1b[1;31m${
        error instanceof Error
          ? error?.toString?.()
          : "ERROR: " + (error?.toString?.() || "error is missing toString()")
      }\x1b[0m`
    );
  }

  rl.query("> ").then(runCommand);
}

global.app = app;

rl.writeln();
rl.query("> ").then(runCommand);

rl.on("close", () => {
  console.clear();
  process.exit(0);
});
