import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Package root (packages/create-zenpanel) — works from src/ and dist/. */
export function getPackageRoot(): string {
  return path.resolve(__dirname, "..");
}

export function getTemplatesDir(): string {
  return path.join(getPackageRoot(), "templates");
}

export type FrameworkId =
  | "nextjs"
  | "react"
  | "preact"
  | "solid"
  | "svelte"
  | "vue"
  | "html"
  | "remix"
  | "astro"
  | "angular";

/** CLI may still accept legacy `vite` as an alias for `react`. */
export type FrameworkCliId = FrameworkId | "vite";

export type FrameworkOption = {
  id: FrameworkId;
  label: string;
  hint: string;
  available: boolean;
};

export const FRAMEWORKS: FrameworkOption[] = [
  {
    id: "nextjs",
    label: "Next.js",
    hint: "App Router + Tailwind",
    available: true,
  },
  {
    id: "react",
    label: "React",
    hint: "Vite + React Router + Tailwind",
    available: true,
  },
  {
    id: "preact",
    label: "Preact",
    hint: "Vite + Preact + Tailwind",
    available: true,
  },
  {
    id: "solid",
    label: "Solid",
    hint: "Vite + Solid Router + Tailwind",
    available: true,
  },
  {
    id: "svelte",
    label: "Svelte",
    hint: "Vite + Svelte 5 SPA",
    available: true,
  },
  {
    id: "vue",
    label: "Vue",
    hint: "Vite + Vue 3 SPA",
    available: true,
  },
  {
    id: "html",
    label: "HTML",
    hint: "Plain HTML + Tailwind v4 CLI (no Vite)",
    available: true,
  },
  {
    id: "astro",
    label: "Astro",
    hint: "Astro 7 + React admin (Next.js UI)",
    available: true,
  },
  {
    id: "angular",
    label: "Angular",
    hint: "Angular 22 + Tailwind (Next.js UI)",
    available: true,
  },
  {
    id: "remix",
    label: "Remix",
    hint: "Coming soon",
    available: false,
  },
];

export const ADMIN_PEER_DEPS = [
  "clsx",
  "lucide-react",
  "next-themes",
  "tailwind-merge",
] as const;

export const PACKAGE_NAME = "create-zenpanel";

/** Map legacy / alias ids onto the template folder name. */
export function normalizeFrameworkId(id: string): FrameworkId | null {
  if (id === "vite") return "react";
  if (
    id === "nextjs" ||
    id === "react" ||
    id === "preact" ||
    id === "solid" ||
    id === "svelte" ||
    id === "vue" ||
    id === "html" ||
    id === "astro" ||
    id === "angular" ||
    id === "remix"
  ) {
    return id;
  }
  return null;
}
