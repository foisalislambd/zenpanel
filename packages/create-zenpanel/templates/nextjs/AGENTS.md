<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:zenpanel-agent-rules -->

# ZenPanel admin

This repo includes a ZenPanel admin shell. When the user asks to change the admin panel, extend these files — do not replace them with a new dashboard.

## Preview auth

- Login is UI-only. Preview credentials: `admin` / `admin`.
- Do not add real authentication, env secrets, or a backend unless the user asks.

## Where to edit (nextjs)

- App Router admin lives under `src/app/admin` (or `app/admin` when the host has no `src/`).
- Branding: `src/config/admin.config.ts` (or `config/admin.config.ts`). Sidebar: `src/lib/admin-nav.ts` (or `lib/admin-nav.ts`).
- Shared UI: `src/components/admin/` (or `components/admin/`). Auth preview: `…/components/admin/auth/`.
- Keep Next.js's own `<!-- BEGIN:nextjs-agent-rules -->` block intact. Read `node_modules/next/dist/docs/` before changing Next.js APIs.

## Conventions

- Reuse existing admin components (layout, tables, charts, chat, forms).
- Tailwind v4 with brand tokens (`brand-*`, `gray-*`). Dark mode is class-based (`.dark`), not `prefers-color-scheme` alone.
- Keep admin URLs under `/admin`.
- Match the template's file names, import aliases, and component patterns.
- Content outside these markers is yours; create-zenpanel only rewrites this block.

<!-- END:zenpanel-agent-rules -->
