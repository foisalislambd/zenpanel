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

const NEXT_RELATIVE_PATHS = [
  "app/admin",
  "components/admin",
  "components/theme",
  "config/admin.config.ts",
  "context",
  "hooks",
  "lib/admin-api",
  "lib/admin-data",
  "lib/admin-nav.ts",
  "lib/cn.ts",
  "lib/delay.ts",
  "lib/format.ts",
] as const;

const VITE_COPY_PATHS = [
  "src/layouts",
  "src/pages/admin",
  "src/routes",
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
  "src/zenpanel-admin-routes.example.tsx",
] as const;

const ASTRO_COPY_PATHS = [
  "src/components/AdminResourcePage.astro",
  "src/layouts/AdminLayout.astro",
  "src/pages/admin",
  "src/scripts",
  "src/styles/admin.css",
  "src/zenpanel-admin.example.ts",
] as const;

const HTML_COPY_PATHS = [
  "admin",
  "css",
  "js",
  "public",
  "favicon.svg",
  "serve.json",
] as const;

const THEME_TOKENS_SNIPPET = `
/* ZenPanel theme tokens (added by create-zenpanel) */
@theme inline {
  --color-brand-50: #ecf3ff;
  --color-brand-100: #dde9ff;
  --color-brand-300: #9cb9ff;
  --color-brand-400: #7592ff;
  --color-brand-500: #465fff;
  --color-brand-600: #3641f5;
  --color-brand-800: #252dae;
  --color-brand-950: #161950;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f2f4f7;
  --color-gray-200: #e4e7ec;
  --color-gray-300: #d0d5dd;
  --color-gray-400: #98a2b3;
  --color-gray-500: #667085;
  --color-gray-600: #475467;
  --color-gray-700: #344054;
  --color-gray-800: #1d2939;
  --color-gray-900: #101828;
  --color-success-50: #ecfdf3;
  --color-success-500: #12b76a;
  --color-success-600: #039855;
  --color-error-50: #fef3f2;
  --color-error-500: #f04438;
}
`;

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

  let framework: "nextjs" | "vite" | "html" | "astro" | "unknown" =
    detectFrameworkFromPackage(pkg);

  if (framework === "unknown") {
    const result = await p.select({
      message: "Could not detect framework. Which are you using?",
      options: [
        { value: "nextjs" as const, label: "Next.js" },
        { value: "vite" as const, label: "Vite (React)" },
        { value: "astro" as const, label: "Astro" },
        { value: "html" as const, label: "HTML (static)" },
      ],
    });

    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    framework = result as "nextjs" | "vite" | "html" | "astro";
  } else {
    p.log.step(`Detected framework: ${pc.cyan(framework)}`);
  }

  const templateDir = path.join(getTemplatesDir(), framework);

  const copyJobs =
    framework === "nextjs"
      ? await buildNextCopyJobs(cwd, templateDir)
      : framework === "vite"
        ? VITE_COPY_PATHS.map((rel) => ({
            src: path.join(templateDir, rel),
            dest: path.join(cwd, rel),
            label: rel,
          }))
        : framework === "astro"
          ? ASTRO_COPY_PATHS.map((rel) => ({
              src: path.join(templateDir, rel),
              dest: path.join(cwd, rel),
              label: rel,
            }))
          : HTML_COPY_PATHS.map((rel) => ({
              src: path.join(templateDir, rel),
              dest: path.join(cwd, rel),
              label: rel,
            }));

  const conflicts = [];
  for (const job of copyJobs) {
    if (await pathExists(job.dest)) {
      conflicts.push(job.label);
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
    for (const job of copyJobs) {
      if (!(await pathExists(job.src))) continue;
      await fs.ensureDir(path.dirname(job.dest));
      await fs.copy(job.src, job.dest, { overwrite: true });
    }

    if (framework === "nextjs") {
      await mergeNextStyles(cwd, templateDir);
    } else if (framework === "vite") {
      await mergeViteStyles(cwd, templateDir);
    } else if (framework === "html") {
      await ensureHtmlServeScripts(cwd);
    }

    spinner.stop("Admin files copied.");
  } catch (error) {
    spinner.stop("Failed to copy admin files.");
    throw error;
  }

  const depsToInstall: string[] = [];
  if (framework === "nextjs" || framework === "vite") {
    depsToInstall.push(...ADMIN_PEER_DEPS);
  }
  if (framework === "vite") {
    depsToInstall.push("react-router-dom");
  }
  if (framework === "html") {
    depsToInstall.push("serve");
  }

  if (!options.skipInstall && depsToInstall.length > 0) {
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
          "Ensure Tailwind CSS v4 is configured.",
          "Wrap your root layout with ThemeProvider from @/components/theme/theme-provider.",
          "Admin routes live under /admin (login at /admin/login).",
          "Preview credentials: admin / admin.",
        ]
      : framework === "vite"
        ? [
            "Merge zenPanelAdminRoute from src/routes/admin-routes.tsx (or the .example file) into your <Routes>.",
            "Import ./admin.css in your main CSS (done automatically when src/index.css exists).",
            "Wrap the app with ThemeProvider from @/components/theme/theme-provider.",
            "Preview credentials: admin / admin.",
          ]
        : framework === "astro"
          ? [
              "Admin pages were copied to src/pages/admin — open /admin/login after `npm run dev`.",
              "Customize branding in src/scripts/config.js.",
              "Preview credentials: admin / admin.",
            ]
          : [
              "Start the static server with `npm run dev` (or `npx serve . -l 5173`).",
              "Open /admin/login — preview credentials: admin / admin.",
              "Customize branding in js/config.js.",
            ];

  p.note(tips.map((t) => `• ${t}`).join("\n"), "Next steps");
  p.outro(pc.green("ZenPanel admin shell installed."));
}

async function buildNextCopyJobs(
  projectDir: string,
  templateDir: string,
): Promise<Array<{ src: string; dest: string; label: string }>> {
  const srcRoot = await detectNextSrcRoot(projectDir);
  const prefix = srcRoot ? `${srcRoot}/` : "";

  return NEXT_RELATIVE_PATHS.map((rel) => {
    // Template always ships under src/
    const templateRel = `src/${rel}`;
    const destRel = `${prefix}${rel}`;
    return {
      src: path.join(templateDir, templateRel),
      dest: path.join(projectDir, destRel),
      label: destRel,
    };
  });
}

/**
 * Prefer existing Next.js layout conventions:
 * - src/app → copy into src/
 * - app (root) → copy into project root
 * - otherwise default to src/ (create-next-app default)
 */
async function detectNextSrcRoot(
  projectDir: string,
): Promise<"src" | ""> {
  if (await pathExists(path.join(projectDir, "src", "app"))) return "src";
  if (await pathExists(path.join(projectDir, "app"))) return "";
  if (await pathExists(path.join(projectDir, "src"))) return "src";
  return "src";
}

async function mergeNextStyles(
  projectDir: string,
  templateDir: string,
): Promise<void> {
  const srcRoot = await detectNextSrcRoot(projectDir);
  const adminCssRel = srcRoot
    ? "src/app/admin/admin.css"
    : "app/admin/admin.css";

  const adminCssSrc = path.join(templateDir, "src/app/admin/admin.css");
  const adminCssDest = path.join(projectDir, adminCssRel);
  if (await pathExists(adminCssSrc)) {
    await fs.ensureDir(path.dirname(adminCssDest));
    await fs.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }

  const globalsCandidates = [
    path.join(projectDir, "src/app/globals.css"),
    path.join(projectDir, "app/globals.css"),
    path.join(projectDir, "src/index.css"),
  ];

  for (const globals of globalsCandidates) {
    if (!(await pathExists(globals))) continue;
    const content = await fs.readFile(globals, "utf8");
    if (content.includes("--color-brand-500")) {
      return;
    }
    await fs.appendFile(globals, THEME_TOKENS_SNIPPET);
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
  if (!(await pathExists(indexCss))) return;

  let content = await fs.readFile(indexCss, "utf8");
  let changed = false;

  if (!content.includes("admin.css")) {
    content = `${content.trimEnd()}\n\n@import "./admin.css";\n`;
    changed = true;
  }

  if (!content.includes("--color-brand-500")) {
    content = `${content.trimEnd()}\n${THEME_TOKENS_SNIPPET}`;
    changed = true;
  }

  if (changed) {
    await fs.writeFile(indexCss, content);
  }
}

/** Add serve scripts when the project does not already define them. */
async function ensureHtmlServeScripts(projectDir: string): Promise<void> {
  const pkgPath = path.join(projectDir, "package.json");
  if (!(await pathExists(pkgPath))) return;

  const pkg = await fs.readJson(pkgPath);
  pkg.scripts ??= {};

  const defaults: Record<string, string> = {
    dev: "serve . -l 5173 --no-clipboard",
    start: "serve . -l 5173 --no-clipboard",
    preview: "serve . -l 5173 --no-clipboard",
  };

  let changed = false;
  for (const [name, command] of Object.entries(defaults)) {
    if (!pkg.scripts[name]) {
      pkg.scripts[name] = command;
      changed = true;
    }
  }

  if (changed) {
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}
