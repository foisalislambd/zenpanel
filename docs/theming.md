# Theming

ZenPanel ships with **light and dark** modes and shared brand/gray tokens (Tailwind CSS v4).

## Toggle

- Header and login screens include a theme control.
- Preference is stored in `localStorage` (key varies by template; commonly `zenpanel-theme` or via `next-themes`).
- Dark mode applies a `dark` class on `<html>` (class strategy).

## Design tokens

Brand colors live in the template CSS / `@theme` block, for example:

- `brand-500` / `brand-600` — primary actions and active nav
- `gray-*` — surfaces, borders, muted text
- `success-*` / `error-*` — status accents

**Next.js / Vite templates:** check `src/app/globals.css` or `src/index.css`.  
**HTML:** edit `src/css/input.css`, then run `npm run build` (Tailwind CLI).  
**Astro:** edit `src/styles/global.css`.

## Fonts

Templates use **Geist** (UI) and **Outfit** (admin shell) from Google Fonts where applicable. Swap the `<link>` / CSS `--font-*` variables to rebrand typography.
