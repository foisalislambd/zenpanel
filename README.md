# ZenPanel

[![CI](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml/badge.svg)](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Open-source admin UI shell — sidebar, dashboard, resource tables, login, and dark mode.

Scaffold a new app with **Next.js**, **Vite**, **HTML**, or **Astro**, or install the admin panel into an existing project.

No backend included. The dashboard ships with sample preview data so you can review the UI; connect your own API when you are ready.

<p align="center">
  <img src="docs/images/light-panel-image.png" alt="ZenPanel dashboard in light mode" width="100%" />
</p>

<p align="center">
  <img src="docs/images/dark-panel-image.png" alt="ZenPanel dashboard in dark mode" width="100%" />
</p>

## Quick start

**Requirements:** Node.js 20+ (Astro template needs Node.js 22.12+)

### Create a new project

```bash
npx create-zenpanel@latest
```

You will be asked to:

1. Enter a project name
2. Select a framework — **Next.js**, **Vite**, **HTML**, **Astro** (Remix coming soon)

```bash
npx create-zenpanel@latest my-admin --framework nextjs
npx create-zenpanel@latest my-admin --framework vite
npx create-zenpanel@latest my-admin --framework html
npx create-zenpanel@latest my-admin --framework astro
```

Then:

```bash
cd my-admin
npm run dev
```

Open the admin login:

- Next.js: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Vite / HTML: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- Astro: [http://localhost:4321/admin/login](http://localhost:4321/admin/login)

Demo credentials: `admin` / `admin`.

### Install into an existing project

If the current folder already has a `package.json`, the CLI installs the admin shell into that project:

```bash
cd your-existing-app
npx create-zenpanel@latest
```

## Features

- Responsive admin layout with sidebar, header, and breadcrumbs
- Dashboard overview — stats, revenue chart, activity feed, quick actions
- Resource list pages ready to wire to your API
- Login screen with preview auth (in-memory only)
- Light and dark themes via `next-themes`
- Brand name, tagline, and navigation in one config file

## Customize

Edit `src/config/admin.config.ts` to change:

- Brand name, tagline, and logo letter
- Login page copy and feature bullets
- Sidebar navigation links

## Repository structure

```text
zenpanel/
├── packages/
│   └── create-zenpanel/     # npx create-zenpanel CLI
│       ├── src/             # CLI source
│       └── templates/
│           ├── nextjs/      # Next.js + ZenPanel template
│           ├── vite/        # Vite + React Router template
│           ├── html/        # Plain HTML / CSS / JS template
│           └── astro/       # Astro 7 + vanilla JS template
├── docs/                    # Images and documentation assets
└── README.md
```

## Tech stack

| Package | Role |
| --- | --- |
| Next.js 16 / Vite 8 / Astro 7 | App frameworks |
| React 19 | UI |
| Tailwind CSS 4 | Styling |
| next-themes | Light / dark mode |
| lucide-react | Icons |

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).

- Issues: [github.com/Foisalislambd/zenpanel/issues](https://github.com/Foisalislambd/zenpanel/issues)
- Security: [SECURITY.md](./SECURITY.md)
- Changelog: [CHANGELOG.md](./CHANGELOG.md)

## License

[MIT](./LICENSE) © Foisal Islam
