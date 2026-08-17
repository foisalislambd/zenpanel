import fs from "fs-extra";
import path from "node:path";
import type { FrameworkId } from "./constants";

export const ZENPANEL_AGENT_RULES_START = "<!-- BEGIN:zenpanel-agent-rules -->";
export const ZENPANEL_AGENT_RULES_END = "<!-- END:zenpanel-agent-rules -->";

const CLAUDE_MD_CONTENT = "@AGENTS.md\n";

export type AgentFileAction = "created" | "updated" | "unchanged";

export type AgentFilesResult = {
  agentsMd: AgentFileAction;
  claudeMd: AgentFileAction | "skipped";
};

function frameworkGuide(framework: FrameworkId): string {
  switch (framework) {
    case "nextjs":
      return `- App Router admin lives under \`src/app/admin\` (or \`app/admin\` when the host has no \`src/\`).
- Branding: \`src/config/admin.config.ts\` (or \`config/admin.config.ts\`). Sidebar: \`src/lib/admin-nav.ts\` (or \`lib/admin-nav.ts\`).
- Shared UI: \`src/components/admin/\` (or \`components/admin/\`). Auth preview: \`…/components/admin/auth/\`.
- Keep Next.js's own \`<!-- BEGIN:nextjs-agent-rules -->\` block intact. Read \`node_modules/next/dist/docs/\` before changing Next.js APIs.`;
    case "react":
    case "preact":
      return `- Vite SPA. Admin pages: \`src/pages/admin/\`. Routes: \`src/routes/admin-routes.tsx\` (merge into the host \`<Routes>\` on existing apps).
- Branding: \`src/config/admin.config.ts\`. Sidebar: \`src/lib/admin-nav.ts\`.
- Shared UI: \`src/components/admin/\`. Styles: \`src/admin.css\` imported from \`src/index.css\`.`;
    case "solid":
      return `- Vite + Solid. Admin pages: \`src/pages/admin/\`. Routes: \`src/routes/admin-routes.tsx\` (merge into the host \`<Router>\`).
- Branding: \`src/config/admin.config.ts\`. Sidebar: \`src/lib/admin-nav.ts\`.
- Shared UI: \`src/components/admin/\`. Styles: \`src/admin.css\`.`;
    case "svelte":
      return `- Vite + Svelte 5. Admin pages: \`src/pages/admin/\`. UI: \`src/components/admin/\`. Entry: \`src/App.svelte\` + \`src/main.ts\`.
- Branding: \`src/config/admin.config.ts\`. Sidebar: \`src/lib/admin-nav.ts\`. Styles: \`src/admin.css\`.`;
    case "vue":
      return `- Vite + Vue 3. Admin pages: \`src/pages/admin/\`. Router: \`src/router/\`. Entry: \`src/App.vue\` + \`src/main.ts\`.
- Branding: \`src/config/admin.config.ts\`. Sidebar: \`src/lib/admin-nav.ts\`. Styles: \`src/admin.css\`.`;
    case "html":
      return `- Static HTML under \`src/\` (admin pages in \`src/admin/\`). No bundler.
- Branding: \`src/js/config.js\`. Tailwind CLI builds \`src/css/styles.css\`.`;
    case "astro":
      return `- Astro pages: \`src/pages/admin/\`. Layout: \`src/layouts/AdminLayout.astro\`.
- Branding: \`src/scripts/config.js\`. Styles: \`src/styles/admin.css\`.`;
    case "angular":
      return `- Angular app under \`src/app/\`. Admin routes open at \`/admin/login\` (ng serve, port 4200).
- Branding: \`src/app/core/admin.config.ts\`. Sidebar: \`src/app/core/admin-nav.ts\`. Styles: \`src/admin.css\` imported from \`src/styles.css\`.`;
    case "remix":
      return `- Remix template is not available yet. Do not invent a Remix admin from other frameworks.`;
  }
}

export function buildZenpanelAgentRulesBlock(framework: FrameworkId): string {
  return `${ZENPANEL_AGENT_RULES_START}

# ZenPanel admin

This repo includes a ZenPanel admin shell. When the user asks to change the admin panel, extend these files — do not replace them with a new dashboard.

## Preview auth

- Login is UI-only. Preview credentials: \`admin\` / \`admin\`.
- Do not add real authentication, env secrets, or a backend unless the user asks.

## Where to edit (${framework})

${frameworkGuide(framework)}

## Conventions

- Reuse existing admin components (layout, tables, charts, chat, forms).
- Tailwind v4 with brand tokens (\`brand-*\`, \`gray-*\`). Dark mode is class-based (\`.dark\`), not \`prefers-color-scheme\` alone.
- Keep admin URLs under \`/admin\`.
- Match the template's file names, import aliases, and component patterns.
- Content outside these markers is yours; create-zenpanel only rewrites this block.

${ZENPANEL_AGENT_RULES_END}`;
}

function detectEol(content: string): "\r\n" | "\n" {
  return /\r\n/.test(content) ? "\r\n" : "\n";
}

function normalizeEol(s: string, eol: "\r\n" | "\n"): string {
  return s.replace(/\r?\n/g, eol);
}

export function upsertZenpanelAgentRulesBlock(
  existing: string,
  block: string,
): string {
  const eol = detectEol(existing.length > 0 ? existing : block);
  const normalizedBlock = normalizeEol(block, eol);

  const startIdx = existing.indexOf(ZENPANEL_AGENT_RULES_START);
  if (startIdx !== -1) {
    const endIdx = existing.indexOf(ZENPANEL_AGENT_RULES_END, startIdx);
    if (endIdx !== -1) {
      const before = existing.slice(0, startIdx);
      const after = existing.slice(endIdx + ZENPANEL_AGENT_RULES_END.length);
      return before + normalizedBlock + after;
    }
    // Start marker without a matching end — replace from the start marker to EOF
    // so a second install cannot append a duplicate block.
    return existing.slice(0, startIdx) + normalizedBlock + eol;
  }

  if (existing.length === 0) {
    return normalizedBlock + eol;
  }

  const separator = /\r?\n$/.test(existing) ? eol : eol + eol;
  return existing + separator + normalizedBlock + eol;
}

async function tryReadFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

/**
 * Upsert the ZenPanel managed block into `AGENTS.md` (create if missing).
 * Preserves Next.js / user content outside the ZenPanel markers.
 * Creates `CLAUDE.md` with `@AGENTS.md` only when it does not exist.
 */
export async function writeZenpanelAgentFiles(
  projectDir: string,
  framework: FrameworkId,
): Promise<AgentFilesResult> {
  const agentsMdPath = path.join(projectDir, "AGENTS.md");
  const claudeMdPath = path.join(projectDir, "CLAUDE.md");
  const block = buildZenpanelAgentRulesBlock(framework);

  const existingAgents = await tryReadFile(agentsMdPath);
  const nextAgents = upsertZenpanelAgentRulesBlock(existingAgents ?? "", block);

  let agentsMd: AgentFileAction;
  if (existingAgents === null) {
    await fs.writeFile(agentsMdPath, nextAgents, "utf8");
    agentsMd = "created";
  } else if (nextAgents === existingAgents) {
    agentsMd = "unchanged";
  } else {
    await fs.writeFile(agentsMdPath, nextAgents, "utf8");
    agentsMd = "updated";
  }

  const claudeExists = await fs.pathExists(claudeMdPath);
  if (!claudeExists) {
    await fs.writeFile(claudeMdPath, CLAUDE_MD_CONTENT, "utf8");
    return { agentsMd, claudeMd: "created" };
  }

  return { agentsMd, claudeMd: "skipped" };
}
