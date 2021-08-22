import { createInterface } from "node:readline";

let commands = {
  help() {},
};

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

function locate(context, command) {
  let idx = command.indexOf(" ");
  let name = command.substr(0, idx);
  let rest = command.substr(idx).trimStart();

  if (!context) return rl.writeln("ERROR: command does not exist");

  let cmd = context[command];

  if (idx == -1) {
    if (typeof cmd == "function") return cmd(rest);
    else return rl.writeln("ERROR: command does not exist");
  } else {
    if (typeof cmd == "function") return cmd(rest);
    else if (typeof cmd == "object") return locate(cmd, rest);
    else return rl.writeln("ERROR: command does not exist");
  }
}

async function callback(command) {
  await locate(commands, command);

  rl.query("zSnout@node:~$ ").then(callback);
}

export default function (app) {
  rl.app = app;

  rl.writeln();
  rl.query("zSnout@node:~$ ").then(callback);

  rl.on("close", () => {
    console.clear();
    process.exit(0);
  });
}
