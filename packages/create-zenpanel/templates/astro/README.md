# ZenPanel (Astro)

Admin UI shell for **Astro 7** with plain HTML, CSS, and JavaScript — no React.

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
- `src/scripts/` — vanilla JS (auth, layout, theme, preview data)
- `src/styles/admin.css` — admin styles
- `src/scripts/config.js` — branding and navigation

## Customize

Edit `src/scripts/config.js` for branding and sidebar links.
