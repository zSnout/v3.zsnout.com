import app from "./fastify.js";
import Database from "./database.js";
import evaluate from "./eval.cjs";
import { createInterface } from "node:readline";

global.app = app;
global.Database = Database;

function toString(_, item) {
  if (typeof item == "function") {
    item = item.toString().split("\n")[0];
    item = item.substr(0, item.length - 1).trim();
  }

  return item;
}

let help = {
  help: "Usage: help\nShows information about all commands and topics.\nUsage: help <topic>\nShows information about a specific command.",
  clear: "Usage: clear\nClears the terminal.",
  exec: "Usage: exec <code>\nExecutes JavaScript and does not print the result.",
  eval: "Usage: eval <code>\nExecutes JavaScript and prints the result.",
  mode: "Usage: mode\nSwitches the console between eval and command modes.",
};

let commands = {
  __proto__: null,
  help(topic) {
    if (!topic) {
      console.log("All topics: " + Object.keys(help).join(", "));
    } else if (topic in help) {
      console.log(help[topic]);
    } else {
      throw new ReferenceError("topic not found");
    }
  },
  clear() {
    rl.clear();
    console.log("\x1b[2m\x1b[3mconsole was cleared\x1b[0m");
  },
  async exec(text) {
    await evaluate(text);
  },
  async eval(text) {
    let content = await evaluate(text);

    console.log(content);
  },
  mode() {
    if (mode == "EVAL") mode = "COMMAND";
    else mode = "EVAL";
  },
};

let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  historySize: 20,
});

rl.clear = console.clear.bind(console);

rl.query = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (resp) => {
      resolve(String(resp));
    });
  });
};

let mode = "EVAL";
async function runCommand(command) {
  try {
    if (mode == "EVAL" && command[0] != ".") {
      console.log(await evaluate(command));
      rl.query(mode == "EVAL" ? "> " : "$ ").then(runCommand);

      return;
    }

    if (command[0] == ".") command = command.substr(1);
    command = command.split(" ");

    let context = commands;
    while (typeof (context = context?.[command.shift()]) == "object");

    if (typeof context != "function")
      throw new ReferenceError("command not found");

    await context(command.join(" "));
  } catch (error) {
    console.log(
      `\x1b[1;31m${
        error instanceof Error
          ? error?.toString?.()
          : "Error: " + error?.toString?.()
      }\x1b[0m`
    );

    rl.query(mode == "EVAL" ? "> " : "$ ").then(runCommand);
  }
}

console.debug("terminal", "started built-in terminal");

commands.clear();
rl.query(mode == "EVAL" ? "> " : "$ ").then(runCommand);

rl.on("close", () => {
  console.clear();
  process.exit(0);
});
