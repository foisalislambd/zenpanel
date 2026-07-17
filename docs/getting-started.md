# Getting started

ZenPanel is an **admin UI shell** (sidebar, dashboard, resources, login, dark mode). There is no backend — preview data is included so you can review the UI first.

## Requirements

- **Node.js 20+** for most templates
- **Node.js 22.12+** for the Astro template

## Create a new project

```bash
npm create zenpanel@latest
```

Same pattern as Vite (`npm create vite@latest`). Equivalent: `npx create-zenpanel@latest`.

You will be prompted for a project name and framework.

Or pass options up front:

```bash
npm create zenpanel@latest my-admin -- --framework nextjs
```

Then:

```bash
cd my-admin
npm run dev
```

## Admin login URLs

| Framework | URL |
| --- | --- |
| Next.js | http://localhost:3000/admin/login |
| React / Preact / Solid / Svelte / Vue / HTML | http://localhost:5173/admin/login |
| Astro | http://localhost:4321/admin/login |
| Angular | http://localhost:4200/admin/login |

**Preview credentials:** `admin` / `admin` (UI only — not real authentication).

## Install into an existing app

If the current folder already has a `package.json`:

```bash
cd your-existing-app
npm create zenpanel@latest
```

Force install mode:

```bash
npx create-zenpanel@latest --install
```

See [CLI reference](./cli.md) and [Customization](./customization.md) next.
