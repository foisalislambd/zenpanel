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

export type FrameworkId = "nextjs" | "vite" | "html" | "remix" | "astro";

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
    id: "vite",
    label: "Vite",
    hint: "React + React Router + Tailwind",
    available: true,
  },
  {
    id: "html",
    label: "HTML",
    hint: "Plain HTML, CSS, and JavaScript",
    available: true,
  },
  {
    id: "astro",
    label: "Astro",
    hint: "Astro 7 + vanilla HTML/CSS/JS",
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
