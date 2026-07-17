# Customization

## Branding and navigation

Most templates use a single config file for brand + sidebar:

| Framework | Config path |
| --- | --- |
| Next.js / React / Preact / Solid | `src/config/admin.config.ts` |
| Svelte / Vue | `src/config/admin.config.ts` |
| Angular | `src/app/core/admin.config.ts` |
| HTML | `src/js/config.js` |
| Astro | `src/scripts/config.js` |

Typical fields:

- `brand.name`, `brand.tagline`, `brand.letter`
- `brand.siteUrl` (sidebar “View site”)
- Login description + feature bullets
- `adminNavItems` — sidebar links (`name`, `href`, icon)

After changing nav hrefs, make sure matching routes/pages exist.

## Layout pieces

Common areas to edit:

- **Sidebar / header** — layout components under `components/admin/layout` (or HTML/Astro `layout.js`)
- **Dashboard widgets** — `components/admin/dashboard/*` or `dashboard.js`
- **Resource empty states** — resource list / page components
- **Settings** — account settings UI

## Preview auth

Login accepts `admin` / `admin` for the UI demo. Replace with your auth provider (cookies, JWT, OAuth, etc.) before production.

See [Connect your API](./connecting-api.md).
