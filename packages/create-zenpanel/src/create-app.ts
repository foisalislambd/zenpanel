import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { getTemplatesDir, type FrameworkId } from "./constants";
import {
  installDependencies,
  isDirectoryEmpty,
  isValidProjectName,
  pathExists,
  toValidPackageName,
  updatePackageName,
} from "./helpers";
import {
  getPackageManager,
  getRunCommand,
  type PackageManager,
} from "./package-manager";

export type CreateAppOptions = {
  projectName?: string;
  framework?: FrameworkId;
  packageManager?: PackageManager;
  skipInstall?: boolean;
};

export async function createApp(options: CreateAppOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const packageManager = options.packageManager ?? getPackageManager();

  p.intro(pc.bgCyan(pc.black(" create-zenpanel ")));

  let projectName = options.projectName;

  if (!projectName) {
    const result = await p.text({
      message: "What is your project named?",
      placeholder: "my-admin",
      defaultValue: "my-admin",
      validate(value) {
        const name = value.trim() || "my-admin";
        if (!isValidProjectName(toValidPackageName(name))) {
          return "Invalid project name";
        }
      },
    });

    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    projectName = (result as string).trim() || "my-admin";
  }

  const packageName = toValidPackageName(path.basename(projectName));
  const targetDir = path.resolve(cwd, projectName);

  if (await pathExists(targetDir)) {
    const empty = await isDirectoryEmpty(targetDir);
    if (!empty) {
      p.log.error(
        `Target directory ${pc.cyan(path.basename(targetDir))} is not empty. Choose another name or remove the folder.`,
      );
      process.exit(1);
    }
  }

  let framework = options.framework;

  if (!framework) {
    const result = await p.select({
      message: "Which framework would you like to use?",
      options: [
        {
          value: "nextjs" as const,
          label: "Next.js",
          hint: "App Router + Tailwind",
        },
        {
          value: "vite" as const,
          label: "Vite",
          hint: "React + React Router + Tailwind",
        },
        {
          value: "html" as const,
          label: "HTML",
          hint: "Plain HTML, CSS, and JavaScript",
        },
        {
          value: "remix" as const,
          label: "Remix",
          hint: "Coming soon",
        },
        {
          value: "astro" as const,
          label: "Astro",
          hint: "Coming soon",
        },
      ],
    });

    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    framework = result as FrameworkId;
  }

  if (framework !== "nextjs" && framework !== "vite" && framework !== "html") {
    p.log.warn(
      `${pc.bold(framework)} support is coming soon. Please choose Next.js, Vite, or HTML.`,
    );
    process.exit(1);
  }

  const templateDir = path.join(getTemplatesDir(), framework);

  if (!(await pathExists(templateDir))) {
    p.log.error(`Template not found: ${framework}`);
    process.exit(1);
  }

  const spinner = p.spinner();
  spinner.start(
    `Creating ${pc.cyan(path.basename(targetDir))} (${framework})…`,
  );

  try {
    await fs.copy(templateDir, targetDir, {
      filter: (src) => {
        const base = path.basename(src);
        return base !== "node_modules" && base !== "dist" && base !== ".next";
      },
    });

    await updatePackageName(targetDir, packageName);
    spinner.stop(`Project ${pc.cyan(path.basename(targetDir))} created.`);
  } catch (error) {
    spinner.stop("Failed to create project.");
    throw error;
  }

  if (!options.skipInstall) {
    const installSpinner = p.spinner();
    installSpinner.start(`Installing dependencies with ${packageManager}…`);
    try {
      await installDependencies(targetDir, packageManager);
      installSpinner.stop("Dependencies installed.");
    } catch (error) {
      installSpinner.stop("Dependency install failed.");
      p.log.warn(
        "You can install manually later with your package manager inside the project folder.",
      );
      console.error(error);
    }
  }

  const relative = path.relative(cwd, targetDir) || ".";
  const cd =
    relative === "." ? "" : `  cd ${relative.includes(" ") ? `"${relative}"` : relative}\n`;

  const loginUrl =
    framework === "html"
      ? "http://localhost:5173/admin/login"
      : framework === "vite"
        ? "http://localhost:5173/admin/login"
        : "http://localhost:3000/admin/login";

  p.note(
    `${cd}  ${getRunCommand(packageManager, "dev")}\n\n  Admin login: ${pc.cyan(loginUrl)}\n  Preview credentials: ${pc.cyan("admin / admin")}`,
    "Next steps",
  );

  p.outro(pc.green("Done! Happy building with ZenPanel."));
}
