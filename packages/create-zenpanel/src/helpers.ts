import fs from "fs-extra";
import path from "node:path";
import spawn from "cross-spawn";
import type { PackageManager } from "./package-manager";

export function isValidProjectName(name: string): boolean {
  return /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(
    name,
  );
}

export function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-~._]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/^@?$/, "zenpanel-app");
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function isDirectoryEmpty(dir: string): Promise<boolean> {
  if (!(await pathExists(dir))) return true;
  const entries = await fs.readdir(dir);
  return entries.filter((e) => e !== ".git" && e !== ".DS_Store").length === 0;
}

export async function readPackageJson(
  dir: string,
): Promise<Record<string, unknown> | null> {
  const pkgPath = path.join(dir, "package.json");
  if (!(await pathExists(pkgPath))) return null;
  return fs.readJson(pkgPath);
}

export function detectFrameworkFromPackage(
  pkg: Record<string, unknown>,
): "nextjs" | "vite" | "astro" | "unknown" {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  if (deps.next) return "nextjs";
  if (deps.astro) return "astro";
  if (deps.vite || deps["@vitejs/plugin-react"]) return "vite";
  return "unknown";
}

export function installDependencies(
  cwd: string,
  packageManager: PackageManager,
  packages?: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args =
      packages && packages.length > 0
        ? getAddArgs(packageManager, packages)
        : getInstallArgs(packageManager);

    const child = spawn(packageManager, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, ADBLOCK: "1", DISABLE_OPENCOLLECTIVE: "1" },
      shell: process.platform === "win32",
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${packageManager} ${args.join(" ")} failed with exit code ${code}`,
          ),
        );
        return;
      }
      resolve();
    });
  });
}

function getInstallArgs(pm: PackageManager): string[] {
  switch (pm) {
    case "yarn":
      return ["install"];
    case "pnpm":
      return ["install"];
    case "bun":
      return ["install"];
    default:
      return ["install"];
  }
}

function getAddArgs(pm: PackageManager, packages: string[]): string[] {
  switch (pm) {
    case "yarn":
      return ["add", ...packages];
    case "pnpm":
      return ["add", ...packages];
    case "bun":
      return ["add", ...packages];
    default:
      return ["install", ...packages];
  }
}

export async function updatePackageName(
  projectDir: string,
  name: string,
): Promise<void> {
  const pkgPath = path.join(projectDir, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.name = name;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}
