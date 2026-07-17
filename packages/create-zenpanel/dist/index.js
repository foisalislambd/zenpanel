#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import path6 from "path";
import pc3 from "picocolors";

// src/create-app.ts
import * as p from "@clack/prompts";
import fs3 from "fs-extra";
import path4 from "path";
import pc from "picocolors";

// src/constants.ts
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
function getPackageRoot() {
  return path.resolve(__dirname, "..");
}
function getTemplatesDir() {
  return path.join(getPackageRoot(), "templates");
}
var ADMIN_PEER_DEPS = [
  "clsx",
  "lucide-react",
  "next-themes",
  "tailwind-merge"
];

// src/helpers.ts
import fs from "fs-extra";
import path2 from "path";
import spawn from "cross-spawn";
function isValidProjectName(name) {
  return /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/i.test(
    name
  );
}
function toValidPackageName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-~._]/g, "").replace(/^-+|-+$/g, "").replace(/^@?$/, "zenpanel-app");
}
async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
async function isDirectoryEmpty(dir) {
  if (!await pathExists(dir)) return true;
  const entries = await fs.readdir(dir);
  return entries.filter((e) => e !== ".git" && e !== ".DS_Store").length === 0;
}
async function readPackageJson(dir) {
  const pkgPath = path2.join(dir, "package.json");
  if (!await pathExists(pkgPath)) return null;
  return fs.readJson(pkgPath);
}
function detectFrameworkFromPackage(pkg2) {
  const deps = {
    ...pkg2.dependencies,
    ...pkg2.devDependencies
  };
  if (deps.next) return "nextjs";
  if (deps.vite || deps["@vitejs/plugin-react"]) return "vite";
  return "unknown";
}
function installDependencies(cwd, packageManager, packages) {
  return new Promise((resolve, reject) => {
    const args = packages && packages.length > 0 ? getAddArgs(packageManager, packages) : getInstallArgs(packageManager);
    const child = spawn(packageManager, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, ADBLOCK: "1", DISABLE_OPENCOLLECTIVE: "1" },
      shell: process.platform === "win32"
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${packageManager} ${args.join(" ")} failed with exit code ${code}`
          )
        );
        return;
      }
      resolve();
    });
  });
}
function getInstallArgs(pm) {
  switch (pm) {
    case "yarn":
      return [];
    case "pnpm":
      return ["install"];
    case "bun":
      return ["install"];
    default:
      return ["install"];
  }
}
function getAddArgs(pm, packages) {
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
async function updatePackageName(projectDir, name) {
  const pkgPath = path2.join(projectDir, "package.json");
  const pkg2 = await fs.readJson(pkgPath);
  pkg2.name = name;
  await fs.writeJson(pkgPath, pkg2, { spaces: 2 });
}

// src/package-manager.ts
import fs2 from "fs-extra";
import path3 from "path";
function getPackageManager() {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm";
}
function getRunCommand(pm, script) {
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

// src/create-app.ts
async function createApp(options = {}) {
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
      }
    });
    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    projectName = result.trim() || "my-admin";
  }
  const packageName = toValidPackageName(projectName);
  const targetDir = path4.resolve(cwd, projectName);
  if (await pathExists(targetDir)) {
    const empty = await isDirectoryEmpty(targetDir);
    if (!empty) {
      p.log.error(
        `Target directory ${pc.cyan(projectName)} is not empty. Choose another name or remove the folder.`
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
          value: "nextjs",
          label: "Next.js",
          hint: "App Router + Tailwind"
        },
        {
          value: "vite",
          label: "Vite",
          hint: "React + React Router + Tailwind"
        },
        {
          value: "html",
          label: "HTML",
          hint: "Coming soon"
        },
        {
          value: "remix",
          label: "Remix",
          hint: "Coming soon"
        },
        {
          value: "astro",
          label: "Astro",
          hint: "Coming soon"
        }
      ]
    });
    if (p.isCancel(result)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    framework = result;
  }
  if (framework !== "nextjs" && framework !== "vite") {
    p.log.warn(
      `${pc.bold(framework)} support is coming soon. Please choose Next.js or Vite.`
    );
    process.exit(1);
  }
  const templateDir = path4.join(getTemplatesDir(), framework);
  if (!await pathExists(templateDir)) {
    p.log.error(`Template not found: ${framework}`);
    process.exit(1);
  }
  const spinner3 = p.spinner();
  spinner3.start(`Creating ${pc.cyan(projectName)} (${framework})\u2026`);
  try {
    await fs3.copy(templateDir, targetDir, {
      filter: (src) => {
        const base = path4.basename(src);
        return base !== "node_modules" && base !== "dist" && base !== ".next";
      }
    });
    await updatePackageName(targetDir, packageName);
    spinner3.stop(`Project ${pc.cyan(projectName)} created.`);
  } catch (error) {
    spinner3.stop("Failed to create project.");
    throw error;
  }
  if (!options.skipInstall) {
    const installSpinner = p.spinner();
    installSpinner.start(`Installing dependencies with ${packageManager}\u2026`);
    try {
      await installDependencies(targetDir, packageManager);
      installSpinner.stop("Dependencies installed.");
    } catch (error) {
      installSpinner.stop("Dependency install failed.");
      p.log.warn(
        "You can install manually later with your package manager inside the project folder."
      );
      console.error(error);
    }
  }
  const relative = path4.relative(cwd, targetDir) || ".";
  const cd = relative === "." ? "" : `  cd ${relative.includes(" ") ? `"${relative}"` : relative}
`;
  p.note(
    `${cd}  ${getRunCommand(packageManager, "dev")}

  Admin login: ${pc.cyan(framework === "vite" ? "http://localhost:5173/admin/login" : "http://localhost:3000/admin/login")}
  Preview credentials: ${pc.cyan("admin / admin")}`,
    "Next steps"
  );
  p.outro(pc.green("Done! Happy building with ZenPanel."));
}

// src/install.ts
import * as p2 from "@clack/prompts";
import fs4 from "fs-extra";
import path5 from "path";
import pc2 from "picocolors";
var NEXT_COPY_PATHS = [
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
  "src/lib/format.ts"
];
var VITE_COPY_PATHS = [
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
  "src/admin.css"
];
async function installIntoExisting(options = {}) {
  const cwd = process.cwd();
  const packageManager = options.packageManager ?? getPackageManager();
  p2.intro(pc2.bgCyan(pc2.black(" create-zenpanel ")));
  p2.log.info("Detected an existing project \u2014 installing ZenPanel admin shell.");
  const pkg2 = await readPackageJson(cwd);
  if (!pkg2) {
    p2.log.error("No package.json found in the current directory.");
    process.exit(1);
  }
  let framework = detectFrameworkFromPackage(pkg2);
  if (framework === "unknown") {
    const result = await p2.select({
      message: "Could not detect framework. Which are you using?",
      options: [
        { value: "nextjs", label: "Next.js" },
        { value: "vite", label: "Vite (React)" }
      ]
    });
    if (p2.isCancel(result)) {
      p2.cancel("Cancelled.");
      process.exit(0);
    }
    framework = result;
  } else {
    p2.log.step(`Detected framework: ${pc2.cyan(framework)}`);
  }
  const templateDir = path5.join(getTemplatesDir(), framework);
  const copyPaths = framework === "nextjs" ? NEXT_COPY_PATHS : VITE_COPY_PATHS;
  const conflicts = [];
  for (const rel of copyPaths) {
    const dest = path5.join(cwd, rel);
    if (await pathExists(dest)) {
      conflicts.push(rel);
    }
  }
  if (conflicts.length > 0 && !options.force) {
    const confirmed = await p2.confirm({
      message: `${conflicts.length} path(s) already exist (e.g. ${conflicts[0]}). Overwrite?`,
      initialValue: false
    });
    if (p2.isCancel(confirmed) || !confirmed) {
      p2.cancel("Cancelled \u2014 existing files left untouched.");
      process.exit(0);
    }
  }
  const spinner3 = p2.spinner();
  spinner3.start("Copying ZenPanel admin files\u2026");
  try {
    for (const rel of copyPaths) {
      const src = path5.join(templateDir, rel);
      const dest = path5.join(cwd, rel);
      if (!await pathExists(src)) continue;
      await fs4.ensureDir(path5.dirname(dest));
      await fs4.copy(src, dest, { overwrite: true });
    }
    if (framework === "nextjs") {
      await mergeNextStyles(cwd, templateDir);
    } else {
      await mergeViteStyles(cwd, templateDir);
    }
    spinner3.stop("Admin files copied.");
  } catch (error) {
    spinner3.stop("Failed to copy admin files.");
    throw error;
  }
  const depsToInstall = [...ADMIN_PEER_DEPS];
  if (framework === "vite") {
    depsToInstall.push("react-router-dom");
  }
  if (!options.skipInstall) {
    const installSpinner = p2.spinner();
    installSpinner.start(`Installing peer dependencies with ${packageManager}\u2026`);
    try {
      await installDependencies(cwd, packageManager, depsToInstall);
      installSpinner.stop("Peer dependencies installed.");
    } catch (error) {
      installSpinner.stop("Could not install peer dependencies automatically.");
      p2.log.warn(
        `Install manually: ${pc2.cyan(`${packageManager} add ${depsToInstall.join(" ")}`)}`
      );
      console.error(error);
    }
  }
  const tips = framework === "nextjs" ? [
    "Ensure Tailwind is configured (Tailwind CSS v4 recommended).",
    "Wrap your root layout with ThemeProvider from @/components/theme/theme-provider.",
    "Import admin styles \u2014 see src/app/admin/admin.css and merge globals if needed.",
    "Open /admin/login \u2014 preview credentials: admin / admin."
  ] : [
    "Wire admin routes from the Vite template App.tsx into your router.",
    "Import @/admin.css (and ensure Tailwind v4 is set up).",
    "Wrap the app with ThemeProvider from @/components/theme/theme-provider.",
    "Preview credentials: admin / admin."
  ];
  p2.note(tips.map((t) => `\u2022 ${t}`).join("\n"), "Next steps");
  p2.outro(pc2.green("ZenPanel admin shell installed."));
}
async function mergeNextStyles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/app/admin/admin.css");
  const adminCssDest = path5.join(projectDir, "src/app/admin/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.ensureDir(path5.dirname(adminCssDest));
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const globalsCandidates = [
    path5.join(projectDir, "src/app/globals.css"),
    path5.join(projectDir, "app/globals.css"),
    path5.join(projectDir, "src/index.css")
  ];
  for (const globals of globalsCandidates) {
    if (!await pathExists(globals)) continue;
    const content = await fs4.readFile(globals, "utf8");
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
    await fs4.appendFile(globals, brandSnippet);
    return;
  }
}
async function mergeViteStyles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const indexCss = path5.join(projectDir, "src/index.css");
  if (await pathExists(indexCss)) {
    const content = await fs4.readFile(indexCss, "utf8");
    if (!content.includes("admin.css") && !content.includes("--color-brand-500")) {
      await fs4.appendFile(
        indexCss,
        `
@import "./admin.css";
`
      );
    }
  }
}

// src/index.ts
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var pkg = require2("../package.json");
async function main() {
  const program = new Command().name("create-zenpanel").description(
    "Create a ZenPanel admin app, or install the admin panel into an existing project."
  ).version(pkg.version).argument(
    "[project-directory]",
    "Project name / directory (omit to install into the current project when package.json exists)"
  ).option(
    "-f, --framework <framework>",
    "Framework template: nextjs | vite"
  ).option("--use-npm", "Use npm").option("--use-pnpm", "Use pnpm").option("--use-yarn", "Use yarn").option("--use-bun", "Use bun").option("--skip-install", "Skip installing dependencies").option("--force", "Overwrite existing admin files when installing into a project").option(
    "--install",
    "Force install-into-existing mode (requires package.json in cwd)"
  ).action(async (projectDirectory, opts) => {
    const packageManager = resolvePackageManager(opts);
    const framework = opts.framework;
    if (framework && framework !== "nextjs" && framework !== "vite") {
      console.error(
        pc3.red(
          `Unsupported framework "${framework}". Available now: nextjs, vite.`
        )
      );
      process.exit(1);
    }
    const cwd = process.cwd();
    const hasPkg = Boolean(await readPackageJson(cwd));
    const forceInstall = Boolean(opts.install);
    if (hasPkg && !projectDirectory || forceInstall) {
      if (!hasPkg) {
        console.error(
          pc3.red("No package.json in the current directory.")
        );
        process.exit(1);
      }
      await installIntoExisting({
        packageManager,
        skipInstall: Boolean(opts.skipInstall),
        force: Boolean(opts.force)
      });
      return;
    }
    if (projectDirectory && (projectDirectory === "." || path6.resolve(projectDirectory) === cwd) && hasPkg) {
      await installIntoExisting({
        packageManager,
        skipInstall: Boolean(opts.skipInstall),
        force: Boolean(opts.force)
      });
      return;
    }
    await createApp({
      projectName: projectDirectory,
      framework,
      packageManager,
      skipInstall: Boolean(opts.skipInstall)
    });
  });
  await program.parseAsync(process.argv);
}
function resolvePackageManager(opts) {
  if (opts.useNpm) return "npm";
  if (opts.usePnpm) return "pnpm";
  if (opts.useYarn) return "yarn";
  if (opts.useBun) return "bun";
  return void 0;
}
main().catch((error) => {
  console.error(
    pc3.red(error instanceof Error ? error.message : String(error))
  );
  process.exit(1);
});
