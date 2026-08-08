#!/usr/bin/env node
/**
 * Run install / npm scripts inside a create-zenpanel template without cd'ing.
 *
 * Usage:
 *   node scripts/template.mjs <framework> [script] [--] [...args]
 *   node scripts/template.mjs list
 *   node scripts/template.mjs <framework> install
 *
 * Examples:
 *   npm run template -- nextjs
 *   npm run template -- react build
 *   npm run template -- vue install
 *   npm run template -- list
 */

import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templatesDir = join(root, "packages", "create-zenpanel", "templates");

const FRAMEWORKS = readdirSync(templatesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(templatesDir, d.name, "package.json")))
  .map((d) => d.name)
  .sort();

function usage(exitCode = 1) {
  console.log(`Usage:
  npm run template -- <framework> [script] [--] [...args]
  npm run template -- list

Frameworks: ${FRAMEWORKS.join(", ")}

Examples:
  npm run template -- nextjs          # npm run dev (installs if needed)
  npm run template -- react build
  npm run template -- vue install
  npm run template -- angular -- --port 4300`);
  process.exit(exitCode);
}

function run(command, args, cwd) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`Killed by ${signal}`));
        return;
      }
      resolvePromise(code ?? 1);
    });
  });
}

async function ensureInstalled(cwd) {
  if (existsSync(join(cwd, "node_modules"))) return;
  console.log(`→ Installing dependencies in ${cwd}…`);
  const code = await run("npm", ["install"], cwd);
  if (code !== 0) process.exit(code);
}

async function main() {
  const raw = process.argv.slice(2);
  if (raw.length === 0 || raw[0] === "-h" || raw[0] === "--help") {
    usage(raw.length === 0 ? 1 : 0);
  }

  if (raw[0] === "list" || raw[0] === "ls") {
    for (const name of FRAMEWORKS) console.log(name);
    return;
  }

  const framework = raw[0];
  if (!FRAMEWORKS.includes(framework)) {
    console.error(`Unknown framework "${framework}".`);
    console.error(`Available: ${FRAMEWORKS.join(", ")}`);
    process.exit(1);
  }

  const cwd = join(templatesDir, framework);
  let rest = raw.slice(1);

  let script = "dev";
  let scriptArgs = [];

  if (rest[0] === "--") {
    scriptArgs = rest.slice(1);
  } else if (rest.length > 0) {
    script = rest[0];
    const after = rest.slice(1);
    scriptArgs = after[0] === "--" ? after.slice(1) : after;
  }

  if (script === "install" || script === "i") {
    const code = await run("npm", ["install", ...scriptArgs], cwd);
    process.exit(code);
  }

  await ensureInstalled(cwd);

  const argsLabel = scriptArgs.length ? ` -- ${scriptArgs.join(" ")}` : "";
  console.log(`→ ${framework}: npm run ${script}${argsLabel}`);
  const npmArgs =
    scriptArgs.length > 0
      ? ["run", script, "--", ...scriptArgs]
      : ["run", script];
  const code = await run("npm", npmArgs, cwd);
  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
