# ZenPanel

Admin UI shell for Next.js — sidebar, dashboard, resource tables, login, dark mode.

No backend included. The dashboard shows sample preview data so you can review the UI; resource list pages start empty until you connect your API.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Login is prefilled (`admin` / `admin`) — click **Sign in** to open the dashboard. No `.env` or persisted session — auth lives in memory for the UI preview only.

## Copy into a project

Use `web-projects-script/scripts/sync-zenpanel-to-projects.py` to copy into all product frontends, or manually:

1. `src/app/admin`, `src/components/admin`, `src/components/theme`
2. `src/config/admin.config.ts`, `src/context`, `src/lib/admin-api`, `src/lib/admin-data`, `src/lib/cn.ts`
3. Merge admin styles into `globals.css` (see script snippet)
4. Wrap root layout with `ThemeProvider`
5. Install: `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`

## Customize

`src/config/admin.config.ts` — brand name, sidebar links.

## Tech

Next.js 16 · React 19 · Tailwind 4 · next-themes · lucide-react
