/* eslint-disable no-console */

import path from "path";
import fs from "fs";
import { exec } from "child_process";

const rootDir = path.resolve();
const configText = fs.readFileSync("barrels.json", "utf8");
const config = JSON.parse(configText);
const directories: string[] = Array.isArray(config.directory) ? config.directory : [config.directory];


directories.forEach((dir) => {
  const absoluteDir = path.join(rootDir, dir);

  if (!fs.existsSync(absoluteDir)) {
    console.warn(`⚠️ Barrels: Directory not found: ${absoluteDir}`);
    return;
  }

  fs.watch(absoluteDir, { recursive: true }, (_, filename) => {
    if (filename && (filename.endsWith(".ts") || filename.endsWith(".tsx")) && filename !== "index.ts") {
      exec("npx barrelsby -c barrels.json", { cwd: rootDir })
      console.log("✅ Barrels: watched " + absoluteDir)
    }
  });
});

console.log("🚀 Barrels watched " + directories.join(", "))