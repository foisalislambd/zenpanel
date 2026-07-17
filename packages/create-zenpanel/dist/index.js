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
function normalizeFrameworkId(id) {
  if (id === "vite") return "react";
  if (id === "nextjs" || id === "react" || id === "preact" || id === "solid" || id === "svelte" || id === "vue" || id === "html" || id === "astro" || id === "angular" || id === "remix") {
    return id;
  }
  return null;
}

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
  if (deps.astro) return "astro";
  if (deps["@angular/core"] || deps["@angular/cli"]) return "angular";
  if (deps.preact || deps["@preact/preset-vite"]) return "preact";
  if (deps["solid-js"] || deps["vite-plugin-solid"]) return "solid";
  if (deps.svelte || deps["@sveltejs/vite-plugin-svelte"]) return "svelte";
  if (deps.vue || deps["@vitejs/plugin-vue"]) return "vue";
  if (deps["@vitejs/plugin-react"] || deps.vite && deps.react) return "react";
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
    child.on("error", (error) => {
      reject(error);
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
      return ["install"];
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
  const packageName = toValidPackageName(path4.basename(projectName));
  const targetDir = path4.resolve(cwd, projectName);
  if (await pathExists(targetDir)) {
    const empty = await isDirectoryEmpty(targetDir);
    if (!empty) {
      p.log.error(
        `Target directory ${pc.cyan(path4.basename(targetDir))} is not empty. Choose another name or remove the folder.`
      );
      process.exit(1);
    }
  }
  let framework = options.framework ? normalizeFrameworkId(options.framework) ?? void 0 : void 0;
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
          value: "react",
          label: "React",
          hint: "Vite + React Router + Tailwind"
        },
        {
          value: "preact",
          label: "Preact",
          hint: "Vite + Preact + Tailwind"
        },
        {
          value: "solid",
          label: "Solid",
          hint: "Vite + Solid Router + Tailwind"
        },
        {
          value: "svelte",
          label: "Svelte",
          hint: "Vite + Svelte 5 SPA"
        },
        {
          value: "vue",
          label: "Vue",
          hint: "Vite + Vue 3 SPA"
        },
        {
          value: "html",
          label: "HTML",
          hint: "Plain HTML, CSS, and JavaScript"
        },
        {
          value: "astro",
          label: "Astro",
          hint: "Astro 7 + React admin (Next.js UI)"
        },
        {
          value: "angular",
          label: "Angular",
          hint: "Angular 22 + Tailwind (Next.js UI)"
        },
        {
          value: "remix",
          label: "Remix",
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
  if (framework !== "nextjs" && framework !== "react" && framework !== "preact" && framework !== "solid" && framework !== "svelte" && framework !== "vue" && framework !== "html" && framework !== "astro" && framework !== "angular") {
    p.log.warn(
      `${pc.bold(framework)} support is coming soon. Please choose Next.js, React, Preact, Solid, Svelte, Vue, HTML, Astro, or Angular.`
    );
    process.exit(1);
  }
  const templateDir = path4.join(getTemplatesDir(), framework);
  if (!await pathExists(templateDir)) {
    p.log.error(`Template not found: ${framework}`);
    process.exit(1);
  }
  const spinner3 = p.spinner();
  spinner3.start(
    `Creating ${pc.cyan(path4.basename(targetDir))} (${framework})\u2026`
  );
  try {
    await fs3.copy(templateDir, targetDir, {
      filter: (src) => {
        const base = path4.basename(src);
        return base !== "node_modules" && base !== "dist" && base !== ".next" && base !== ".astro" && base !== ".angular";
      }
    });
    await updatePackageName(targetDir, packageName);
    spinner3.stop(`Project ${pc.cyan(path4.basename(targetDir))} created.`);
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
  const loginUrl = framework === "html" || framework === "react" || framework === "preact" || framework === "solid" || framework === "svelte" || framework === "vue" ? "http://localhost:5173/admin/login" : framework === "astro" ? "http://localhost:4321/admin/login" : framework === "angular" ? "http://localhost:4200/admin/login" : "http://localhost:3000/admin/login";
  p.note(
    `${cd}  ${getRunCommand(packageManager, "dev")}

  Admin login: ${pc.cyan(loginUrl)}
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
var NEXT_RELATIVE_PATHS = [
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
  "lib/format.ts"
];
var REACT_COPY_PATHS = [
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
  "src/zenpanel-admin-routes.example.tsx"
];
var ASTRO_COPY_PATHS = [
  "src/components/AdminResourcePage.astro",
  "src/layouts/AdminLayout.astro",
  "src/pages/admin",
  "src/scripts",
  "src/styles/admin.css",
  "src/zenpanel-admin.example.ts"
];
var HTML_COPY_PATHS = [
  "admin",
  "css",
  "js",
  "public",
  "favicon.svg",
  "serve.json"
];
var SVELTE_COPY_PATHS = [
  "src/lib",
  "src/routes",
  "src/App.svelte",
  "src/admin.css",
  "src/main.ts",
  "index.html",
  "public/favicon.svg"
];
var VUE_COPY_PATHS = [
  "src/lib",
  "src/routes",
  "src/App.vue",
  "src/admin.css",
  "src/main.ts",
  "src/vite-env.d.ts",
  "index.html",
  "public/favicon.svg"
];
var ANGULAR_COPY_PATHS = [
  "src/app",
  "src/admin.css",
  "src/styles.css",
  "src/index.html",
  "src/main.ts",
  "public/favicon.svg"
];
var THEME_TOKENS_SNIPPET = `
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
        { value: "react", label: "React (Vite)" },
        { value: "preact", label: "Preact (Vite)" },
        { value: "solid", label: "Solid (Vite)" },
        { value: "svelte", label: "Svelte (Vite)" },
        { value: "vue", label: "Vue (Vite)" },
        { value: "astro", label: "Astro" },
        { value: "angular", label: "Angular" },
        { value: "html", label: "HTML (static)" }
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
  const copyJobs = framework === "nextjs" ? await buildNextCopyJobs(cwd, templateDir) : framework === "react" || framework === "preact" || framework === "solid" ? REACT_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  })) : framework === "svelte" ? SVELTE_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  })) : framework === "vue" ? VUE_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  })) : framework === "astro" ? ASTRO_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  })) : framework === "angular" ? ANGULAR_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  })) : HTML_COPY_PATHS.map((rel) => ({
    src: path5.join(templateDir, rel),
    dest: path5.join(cwd, rel),
    label: rel
  }));
  const conflicts = [];
  for (const job of copyJobs) {
    if (await pathExists(job.dest)) {
      conflicts.push(job.label);
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
    for (const job of copyJobs) {
      if (!await pathExists(job.src)) continue;
      await fs4.ensureDir(path5.dirname(job.dest));
      await fs4.copy(job.src, job.dest, { overwrite: true });
    }
    if (framework === "nextjs") {
      await mergeNextStyles(cwd, templateDir);
    } else if (framework === "react" || framework === "preact" || framework === "solid") {
      await mergeReactStyles(cwd, templateDir);
    } else if (framework === "svelte") {
      await mergeSvelteFiles(cwd, templateDir);
    } else if (framework === "vue") {
      await mergeVueFiles(cwd, templateDir);
    } else if (framework === "astro") {
      await mergeAstroStyles(cwd, templateDir);
    } else if (framework === "angular") {
      await mergeAngularStyles(cwd, templateDir);
    } else if (framework === "html") {
      await ensureHtmlServeScripts(cwd);
    }
    spinner3.stop("Admin files copied.");
  } catch (error) {
    spinner3.stop("Failed to copy admin files.");
    throw error;
  }
  const depsToInstall = [];
  if (framework === "nextjs" || framework === "react" || framework === "preact") {
    depsToInstall.push(...ADMIN_PEER_DEPS);
  }
  if (framework === "react") {
    depsToInstall.push("react-router-dom");
  }
  if (framework === "preact") {
    depsToInstall.push(
      "preact",
      "react-router-dom@6",
      "@preact/preset-vite",
      "@tailwindcss/vite",
      "tailwindcss"
    );
  }
  if (framework === "solid") {
    depsToInstall.push(
      "solid-js",
      "@solidjs/router",
      "lucide-solid",
      "clsx",
      "tailwind-merge",
      "vite-plugin-solid",
      "@tailwindcss/vite",
      "tailwindcss"
    );
  }
  if (framework === "svelte") {
    depsToInstall.push(
      "svelte",
      "@sveltejs/vite-plugin-svelte",
      "@tsconfig/svelte",
      "svelte-check"
    );
  }
  if (framework === "vue") {
    depsToInstall.push(
      "vue",
      "@vitejs/plugin-vue",
      "@vue/tsconfig",
      "vue-tsc"
    );
  }
  if (framework === "html") {
    depsToInstall.push("serve");
  }
  if (framework === "angular") {
    depsToInstall.push("clsx", "tailwind-merge");
  }
  if (!options.skipInstall && depsToInstall.length > 0) {
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
    "Ensure Tailwind CSS v4 is configured.",
    "Wrap your root layout with ThemeProvider from @/components/theme/theme-provider.",
    "Admin routes live under /admin (login at /admin/login).",
    "Preview credentials: admin / admin."
  ] : framework === "react" || framework === "preact" || framework === "solid" ? [
    framework === "solid" ? "Merge ZenPanelAdminRoutes from src/routes/admin-routes.tsx into your <Router>." : "Merge zenPanelAdminRoute from src/routes/admin-routes.tsx (or the .example file) into your <Routes>.",
    "Import ./admin.css in your main CSS (done automatically when src/index.css exists).",
    "Wrap the app with ThemeProvider from @/components/theme/theme-provider.",
    framework === "preact" ? "Alias react \u2192 preact/compat in vite.config (see templates/preact)." : framework === "solid" ? "Ensure vite-plugin-solid and jsxImportSource solid-js in tsconfig." : "Preview credentials: admin / admin.",
    "Preview credentials: admin / admin."
  ].filter((t, i, arr) => arr.indexOf(t) === i) : framework === "svelte" ? [
    "Mount App.svelte from src/main.ts and import ./admin.css (see templates/svelte).",
    "Customize branding in src/lib/config.ts.",
    "Preview credentials: admin / admin."
  ] : framework === "vue" ? [
    "Mount App.vue from src/main.ts and import ./admin.css (see templates/vue).",
    "Customize branding in src/lib/config.ts.",
    "Preview credentials: admin / admin."
  ] : framework === "astro" ? [
    "Admin pages were copied to src/pages/admin \u2014 open /admin/login after `npm run dev`.",
    "Customize branding in src/scripts/config.js.",
    "Preview credentials: admin / admin."
  ] : framework === "angular" ? [
    "Open /admin/login after `npm run dev` (ng serve \u2014 port 4200).",
    "Customize branding in src/app/core/admin.config.ts.",
    "Ensure Tailwind + @tailwindcss/postcss are configured (see templates/angular).",
    "Preview credentials: admin / admin."
  ] : [
    "Start the static server with `npm run dev` (or `npx serve . -l 5173`).",
    "Open /admin/login \u2014 preview credentials: admin / admin.",
    "Customize branding in js/config.js."
  ];
  p2.note(tips.map((t) => `\u2022 ${t}`).join("\n"), "Next steps");
  p2.outro(pc2.green("ZenPanel admin shell installed."));
}
async function buildNextCopyJobs(projectDir, templateDir) {
  const srcRoot = await detectNextSrcRoot(projectDir);
  const prefix = srcRoot ? `${srcRoot}/` : "";
  return NEXT_RELATIVE_PATHS.map((rel) => {
    const templateRel = `src/${rel}`;
    const destRel = `${prefix}${rel}`;
    return {
      src: path5.join(templateDir, templateRel),
      dest: path5.join(projectDir, destRel),
      label: destRel
    };
  });
}
async function detectNextSrcRoot(projectDir) {
  if (await pathExists(path5.join(projectDir, "src", "app"))) return "src";
  if (await pathExists(path5.join(projectDir, "app"))) return "";
  if (await pathExists(path5.join(projectDir, "src"))) return "src";
  return "src";
}
async function mergeNextStyles(projectDir, templateDir) {
  const srcRoot = await detectNextSrcRoot(projectDir);
  const adminCssRel = srcRoot ? "src/app/admin/admin.css" : "app/admin/admin.css";
  const adminCssSrc = path5.join(templateDir, "src/app/admin/admin.css");
  const adminCssDest = path5.join(projectDir, adminCssRel);
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
    if (content.includes("--color-brand-500")) {
      return;
    }
    await fs4.appendFile(globals, THEME_TOKENS_SNIPPET);
    return;
  }
}
async function mergeReactStyles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const indexCss = path5.join(projectDir, "src/index.css");
  if (!await pathExists(indexCss)) return;
  let content = await fs4.readFile(indexCss, "utf8");
  let changed = false;
  if (!content.includes("admin.css")) {
    content = `${content.trimEnd()}

@import "./admin.css";
`;
    changed = true;
  }
  if (!content.includes("--color-brand-500")) {
    content = `${content.trimEnd()}
${THEME_TOKENS_SNIPPET}`;
    changed = true;
  }
  if (changed) {
    await fs4.writeFile(indexCss, content);
  }
}
async function mergeVueFiles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.ensureDir(path5.dirname(adminCssDest));
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const mainSrc = path5.join(templateDir, "src/main.ts");
  const mainDest = path5.join(projectDir, "src/main.ts");
  if (await pathExists(mainSrc) && !await pathExists(mainDest)) {
    await fs4.copy(mainSrc, mainDest);
  }
}
async function mergeSvelteFiles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.ensureDir(path5.dirname(adminCssDest));
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const mainSrc = path5.join(templateDir, "src/main.ts");
  const mainDest = path5.join(projectDir, "src/main.ts");
  if (await pathExists(mainSrc) && !await pathExists(mainDest)) {
    await fs4.copy(mainSrc, mainDest);
  }
}
async function mergeAstroStyles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const globalCssSrc = path5.join(templateDir, "src/styles/global.css");
  const globalCssDest = path5.join(projectDir, "src/styles/global.css");
  if (await pathExists(globalCssSrc) && !await pathExists(globalCssDest)) {
    await fs4.ensureDir(path5.dirname(globalCssDest));
    await fs4.copy(globalCssSrc, globalCssDest);
    return;
  }
  const adminStyleSrc = path5.join(templateDir, "src/styles/admin.css");
  const adminStyleDest = path5.join(projectDir, "src/styles/admin.css");
  if (await pathExists(adminStyleSrc)) {
    await fs4.ensureDir(path5.dirname(adminStyleDest));
    await fs4.copy(adminStyleSrc, adminStyleDest, { overwrite: true });
  }
}
async function mergeAngularStyles(projectDir, templateDir) {
  const adminCssSrc = path5.join(templateDir, "src/admin.css");
  const adminCssDest = path5.join(projectDir, "src/admin.css");
  if (await pathExists(adminCssSrc)) {
    await fs4.copy(adminCssSrc, adminCssDest, { overwrite: true });
  }
  const stylesSrc = path5.join(templateDir, "src/styles.css");
  const stylesDest = path5.join(projectDir, "src/styles.css");
  if (await pathExists(stylesSrc) && !await pathExists(stylesDest)) {
    await fs4.copy(stylesSrc, stylesDest);
    return;
  }
  if (!await pathExists(stylesDest)) return;
  let content = await fs4.readFile(stylesDest, "utf8");
  let changed = false;
  if (!content.includes("admin.css")) {
    content = `${content.trimEnd()}

@import "./admin.css";
`;
    changed = true;
  }
  if (!content.includes("--color-brand-500")) {
    content = `${content.trimEnd()}
${THEME_TOKENS_SNIPPET}`;
    changed = true;
  }
  if (changed) {
    await fs4.writeFile(stylesDest, content);
  }
}
async function ensureHtmlServeScripts(projectDir) {
  const pkgPath = path5.join(projectDir, "package.json");
  if (!await pathExists(pkgPath)) return;
  const pkg2 = await fs4.readJson(pkgPath);
  pkg2.scripts ??= {};
  const defaults = {
    dev: "serve . -l 5173 --no-clipboard",
    start: "serve . -l 5173 --no-clipboard",
    preview: "serve . -l 5173 --no-clipboard"
  };
  let changed = false;
  for (const [name, command] of Object.entries(defaults)) {
    if (!pkg2.scripts[name]) {
      pkg2.scripts[name] = command;
      changed = true;
    }
  }
  if (changed) {
    await fs4.writeJson(pkgPath, pkg2, { spaces: 2 });
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
    "Framework template: nextjs | react | preact | solid | svelte | vue | html | astro | angular (vite \u2192 react alias)"
  ).option("--use-npm", "Use npm").option("--use-pnpm", "Use pnpm").option("--use-yarn", "Use yarn").option("--use-bun", "Use bun").option("--skip-install", "Skip installing dependencies").option("--force", "Overwrite existing admin files when installing into a project").option(
    "--install",
    "Force install-into-existing mode (requires package.json in cwd)"
  ).action(async (projectDirectory, opts) => {
    const packageManager = resolvePackageManager(opts);
    const rawFramework = opts.framework;
    const framework = rawFramework ? normalizeFrameworkId(rawFramework) : void 0;
    if (rawFramework && !framework) {
      console.error(
        pc3.red(
          `Unsupported framework "${rawFramework}". Available now: nextjs, react, preact, solid, svelte, vue, html, astro, angular.`
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
      framework: framework ?? void 0,
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
