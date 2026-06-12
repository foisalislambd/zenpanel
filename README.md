# ZenPanel

Admin UI shell for Next.js — sidebar, dashboard, resource tables, login, dark mode.

No backend included. Tables start empty; connect your API in each product repo.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Environment (required for sign-in)

```env
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your-secret
# optional
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

Session is stored in `localStorage` until you replace auth with a real API.

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
