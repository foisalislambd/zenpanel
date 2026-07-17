import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import {
  getTemplatesDir,
  normalizeFrameworkId,
  type FrameworkId,
} from "./constants";
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
  framework?: FrameworkId | "vite";
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

  let framework: FrameworkId | undefined = options.framework
    ? (normalizeFrameworkId(options.framework) ?? undefined)
    : undefined;

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
          value: "react" as const,
          label: "React",
          hint: "Vite + React Router + Tailwind",
        },
        {
          value: "preact" as const,
          label: "Preact",
          hint: "Vite + Preact + Tailwind",
        },
        {
          value: "solid" as const,
          label: "Solid",
          hint: "Vite + Solid Router + Tailwind",
        },
        {
          value: "svelte" as const,
          label: "Svelte",
          hint: "Vite + Svelte 5 SPA",
        },
        {
          value: "vue" as const,
          label: "Vue",
          hint: "Vite + Vue 3 SPA",
        },
        {
          value: "html" as const,
          label: "HTML",
          hint: "Plain HTML, CSS, and JavaScript",
        },
        {
          value: "astro" as const,
          label: "Astro",
          hint: "Astro 7 + vanilla HTML/CSS/JS",
        },
        {
          value: "remix" as const,
          label: "Remix",
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

  if (
    framework !== "nextjs" &&
    framework !== "react" &&
    framework !== "preact" &&
    framework !== "solid" &&
    framework !== "svelte" &&
    framework !== "vue" &&
    framework !== "html" &&
    framework !== "astro"
  ) {
    p.log.warn(
      `${pc.bold(framework)} support is coming soon. Please choose Next.js, React, Preact, Solid, Svelte, Vue, HTML, or Astro.`,
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
        return (
          base !== "node_modules" &&
          base !== "dist" &&
          base !== ".next" &&
          base !== ".astro"
        );
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
    framework === "html" ||
    framework === "react" ||
    framework === "preact" ||
    framework === "solid" ||
    framework === "svelte" ||
    framework === "vue"
      ? "http://localhost:5173/admin/login"
      : framework === "astro"
        ? "http://localhost:4321/admin/login"
        : "http://localhost:3000/admin/login";

  p.note(
    `${cd}  ${getRunCommand(packageManager, "dev")}\n\n  Admin login: ${pc.cyan(loginUrl)}\n  Preview credentials: ${pc.cyan("admin / admin")}`,
    "Next steps",
  );

  p.outro(pc.green("Done! Happy building with ZenPanel."));
}
