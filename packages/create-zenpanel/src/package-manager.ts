import fs from "fs-extra";
import path from "node:path";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export function getPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? "";

  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm";
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case "pnpm":
      return `pnpm ${script}`;
    case "yarn":
      return `yarn ${script}`;
    case "bun":
      return `bun run ${script}`;
    default:
      return `npm run ${script}`;
  }
}

export async function hasLockfile(
  dir: string,
  pm: PackageManager,
): Promise<boolean> {
  const locks: Record<PackageManager, string> = {
    npm: "package-lock.json",
    pnpm: "pnpm-lock.yaml",
    yarn: "yarn.lock",
    bun: "bun.lockb",
  };
  return fs.pathExists(path.join(dir, locks[pm]));
}
