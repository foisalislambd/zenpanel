import { Command } from "commander";
import path from "node:path";
import pc from "picocolors";
import { createApp } from "./create-app";
import { readPackageJson } from "./helpers";
import { installIntoExisting } from "./install";
import type { FrameworkId } from "./constants";
import type { PackageManager } from "./package-manager";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string; name: string };

async function main() {
  const program = new Command()
    .name("create-zenpanel")
    .description(
      "Create a ZenPanel admin app, or install the admin panel into an existing project.",
    )
    .version(pkg.version)
    .argument(
      "[project-directory]",
      "Project name / directory (omit to install into the current project when package.json exists)",
    )
    .option(
      "-f, --framework <framework>",
      "Framework template: nextjs | vite | html | astro",
    )
    .option("--use-npm", "Use npm")
    .option("--use-pnpm", "Use pnpm")
    .option("--use-yarn", "Use yarn")
    .option("--use-bun", "Use bun")
    .option("--skip-install", "Skip installing dependencies")
    .option("--force", "Overwrite existing admin files when installing into a project")
    .option(
      "--install",
      "Force install-into-existing mode (requires package.json in cwd)",
    )
    .action(async (projectDirectory: string | undefined, opts) => {
      const packageManager = resolvePackageManager(opts);
      const framework = opts.framework as FrameworkId | undefined;

      if (
        framework &&
        framework !== "nextjs" &&
        framework !== "vite" &&
        framework !== "html" &&
        framework !== "astro"
      ) {
        console.error(
          pc.red(
            `Unsupported framework "${framework}". Available now: nextjs, vite, html, astro.`,
          ),
        );
        process.exit(1);
      }

      const cwd = process.cwd();
      const hasPkg = Boolean(await readPackageJson(cwd));
      const forceInstall = Boolean(opts.install);

      // Install-into-existing: package.json in cwd and no new project directory
      if ((hasPkg && !projectDirectory) || forceInstall) {
        if (!hasPkg) {
          console.error(
            pc.red("No package.json in the current directory."),
          );
          process.exit(1);
        }

        await installIntoExisting({
          packageManager,
          skipInstall: Boolean(opts.skipInstall),
          force: Boolean(opts.force),
        });
        return;
      }

      // Creating inside cwd named "." when package.json already exists → install
      if (
        projectDirectory &&
        (projectDirectory === "." || path.resolve(projectDirectory) === cwd) &&
        hasPkg
      ) {
        await installIntoExisting({
          packageManager,
          skipInstall: Boolean(opts.skipInstall),
          force: Boolean(opts.force),
        });
        return;
      }

      await createApp({
        projectName: projectDirectory,
        framework,
        packageManager,
        skipInstall: Boolean(opts.skipInstall),
      });
    });

  await program.parseAsync(process.argv);
}

function resolvePackageManager(opts: {
  useNpm?: boolean;
  usePnpm?: boolean;
  useYarn?: boolean;
  useBun?: boolean;
}): PackageManager | undefined {
  if (opts.useNpm) return "npm";
  if (opts.usePnpm) return "pnpm";
  if (opts.useYarn) return "yarn";
  if (opts.useBun) return "bun";
  return undefined;
}

main().catch((error) => {
  console.error(
    pc.red(error instanceof Error ? error.message : String(error)),
  );
  process.exit(1);
});
