import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { ADMIN_PEER_DEPS, getTemplatesDir } from "./constants";
import {
  detectFrameworkFromPackage,
  installDependencies,
  pathExists,
  readPackageJson,
} from "./helpers";
import {
  getPackageManager,
  type PackageManager,
} from "./package-manager";

export type InstallOptions = {
  packageManager?: PackageManager;
  skipInstall?: boolean;
  force?: boolean;
};

const NEXT_COPY_PATHS = [
  "src/app/admin",
  "src/components/admin",
  "src/components/theme",
  "src/config/admin.config.ts",
  "src/context",
  "src/hooks",
  "src/lib/admin-api",
  "src/lib/admin-data",
  "src/lib/admin-nav.ts",
  "src/lib/cn.ts",
  "src/lib/delay.ts",
  "src/lib/format.ts",
] as const;

const VITE_COPY_PATHS = [
  "src/layouts",
  "src/pages/admin",
  "src/components/admin",
  "src/components/theme",
  "src/config/admin.config.ts",
  "src/context",
  "src/hooks",
  "src/lib/admin-api",
  "src/lib/admin-data",
  "src/lib/admin-nav.ts",
  "src/lib/cn.ts",
  "src/lib/delay.ts",
  "src/lib/format.ts",
  "src/admin.css",
] as const;

export async function installIntoExisting(
  options: InstallOptions = {},
): Promise<void> {
  const cwd = process.cwd();
  const packageManager = options.packageManager ?? getPackageManager();

  p.intro(pc.bgCyan(pc.black(" create-zenpanel ")));
  p.log.info("Detected an existing project — installing ZenPanel admin shell.");

  const pkg = await readPackageJson(cwd);
  if (!pkg) {
    p.log.error("No package.json found in the current directory.");
    process.exit(1);
  }

  let framework = detectFrameworkFromPackage(pkg);

  if (framework === "unknown") {
    const result = await p.select({
      message: "Could not detect framework. Which are you using?",
      options: [
        { value: "nextjs" as const, label: "Next.js" },
        { value: "vite" as const, label: "Vite (React)" },
      ],
    });

    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    framework = result as "nextjs" | "vite";
  } else {
    p.log.step(`Detected framework: ${pc.cyan(framework)}`);
  }

  const templateDir = path.join(getTemplatesDir(), framework);
  const copyPaths = framework === "nextjs" ? NEXT_COPY_PATHS : VITE_COPY_PATHS;

  const conflicts: string[] = [];
  for (const rel of copyPaths) {
    const dest = path.join(cwd, rel);
    if (await pathExists(dest)) {
      conflicts.push(rel);
    }
  }

  if (conflicts.length > 0 && !options.force) {
    const confirmed = await p.confirm({
      message: `${conflicts.length} path(s) already exist (e.g. ${conflicts[0]}). Overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled — existing files left untouched.");
      process.exit(0);
    }
  }

  const spinner = p.spinner();
  spinner.start("Copying ZenPanel admin files…");

  try {
    for (const rel of copyPaths) {
      const src = path.join(templateDir, rel);
      const dest = path.join(cwd, rel);
      if (!(await pathExists(src))) continue;
      await fs.ensureDir(path.dirname(dest));
      await fs.copy(src, dest, { overwrite: true });
    }

    // Styles
    if (framework === "nextjs") {
      await mergeNextStyles(cwd, templateDir);
    } else {
      await mergeViteStyles(cwd, templateDir);
    }

    spinner.stop("Admin files copied.");
  } catch (error) {
    spinner.stop("Failed to copy admin files.");
    throw error;
  }

  const depsToInstall: string[] = [...ADMIN_PEER_DEPS];
  if (framework === "vite") {
    depsToInstall.push("react-router-dom");
  }

  if (!options.skipInstall) {
    const installSpinner = p.spinner();
    installSpinner.start(`Installing peer dependencies with ${packageManager}…`);
    try {
      await installDependencies(cwd, packageManager, depsToInstall);
      installSpinner.stop("Peer dependencies installed.");
    } catch (error) {
      installSpinner.stop("Could not install peer dependencies automatically.");
      p.log.warn(
        `Install manually: ${pc.cyan(`${packageManager} add ${depsToInstall.join(" ")}`)}`,
      );
      console.error(error);
    }
  }

  const tips =
    framework === "nextjs"
      ? [
          "Ensure Tailwind is configured (Tailwind CSS v4 recommended).",
          "Wrap your root layout with ThemeProvider from @/components/theme/theme-provider.",
          "Import admin styles — see src/app/admin/admin.css and merge globals if needed.",
          "Open /admin/login — preview credentials: admin / admin.",
        ]
      : [
          "Wire admin routes from the Vite template App.tsx into your router.",
          "Import @/admin.css (and ensure Tailwind v4 is set up).",
          "Wrap the app with ThemeProvider from @/components/theme/theme-provider.",
          "Preview credentials: admin / admin.",
        ];

  p.note(tips.map((t) => `• ${t}`).join("\n"), "Next steps");
  p.outro(pc.green("ZenPanel admin shell installed."));
}

async function mergeNextStyles(
  projectDir: string,
  templateDir: string,
): Promise<void> {
  const adminCssSrc = path.join(templateDir, "src/app/admin/admin.css");
  const adminCssDest = path.join(projectDir, "src/app/admin/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs.ensureDir(path.dirname(adminCssDest));
    await fs.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }

  // Append a short marker into globals.css if present and not already linked
  const globalsCandidates = [
    path.join(projectDir, "src/app/globals.css"),
    path.join(projectDir, "app/globals.css"),
    path.join(projectDir, "src/index.css"),
  ];

  for (const globals of globalsCandidates) {
    if (!(await pathExists(globals))) continue;
    const content = await fs.readFile(globals, "utf8");
    if (content.includes("zenpanel-brand") || content.includes("--color-brand-500")) {
      return;
    }

    const brandSnippet = `

/* ZenPanel brand tokens (added by create-zenpanel) */
@theme inline {
  --color-brand-50: #ecf3ff;
  --color-brand-100: #dde9ff;
  --color-brand-300: #9cb9ff;
  --color-brand-400: #7592ff;
  --color-brand-500: #465fff;
  --color-brand-600: #3641f5;
  --color-brand-800: #252dae;
  --color-brand-950: #161950;
}
`;
    await fs.appendFile(globals, brandSnippet);
    return;
  }
}

async function mergeViteStyles(
  projectDir: string,
  templateDir: string,
): Promise<void> {
  const adminCssSrc = path.join(templateDir, "src/admin.css");
  const adminCssDest = path.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }

  const indexCss = path.join(projectDir, "src/index.css");
  if (await pathExists(indexCss)) {
    const content = await fs.readFile(indexCss, "utf8");
    if (!content.includes('admin.css') && !content.includes("--color-brand-500")) {
      await fs.appendFile(
        indexCss,
        `\n@import "./admin.css";\n`,
      );
    }
  }
}
