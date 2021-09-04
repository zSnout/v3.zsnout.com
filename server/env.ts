import { existsSync, copyFileSync, readFileSync, writeFile } from "node:fs";
import { config } from "dotenv";

if (!existsSync(".env")) {
  copyFileSync(".env-template", ".env");
}

config();
