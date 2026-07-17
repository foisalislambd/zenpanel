# ZenPanel (Astro)

Admin UI shell for **Astro 7** with vanilla HTML, CSS, and JavaScript — same UI as the HTML and Next.js templates. No React islands.

Uses **Tailwind CSS v4** via `@tailwindcss/vite` (Vite-native, no CLI build step).

Based on the latest `create-astro` scaffold (`astro@^7`, Node `>=22.12.0`).

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

Open [http://localhost:4321/admin/login](http://localhost:4321/admin/login).

Preview credentials: `admin` / `admin`.

## Structure

- `src/pages/admin/` — Astro routes for the admin shell
- `src/scripts/` — vanilla JS (auth, layout, dashboard, resource pages, theme)
- `src/styles/global.css` — Tailwind v4 entry (`@import "tailwindcss"`, `@theme`, `@source`)
- `src/styles/admin.css` / `shell.css` — admin shell tokens (shared with HTML template)
- `src/scripts/config.js` — branding and navigation

## Customize

Edit `src/scripts/config.js` for branding and sidebar links.
