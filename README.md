# ZenPanel

[![CI](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml/badge.svg)](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Open-source admin UI shell for Next.js — sidebar, dashboard, resource tables, login, and dark mode.

No backend included. The dashboard ships with sample preview data so you can review the UI; connect your own API when you are ready.

<p align="center">
  <img src="docs/images/light-panel-image.png" alt="ZenPanel dashboard in light mode" width="100%" />
</p>

<p align="center">
  <img src="docs/images/dark-panel-image.png" alt="ZenPanel dashboard in dark mode" width="100%" />
</p>

## Features

- Responsive admin layout with sidebar, header, and breadcrumbs
- Dashboard overview — stats, revenue chart, activity feed, quick actions
- Resource list pages ready to wire to your API
- Login screen with preview auth (in-memory only)
- Light and dark themes via `next-themes`
- Brand name, tagline, and navigation in one config file

## Quick start

**Requirements:** Node.js 20+

```bash
git clone https://github.com/Foisalislambd/zenpanel.git
cd zenpanel
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Demo login is prefilled (`admin` / `admin`) — click **Sign in** to open the dashboard. No `.env` file and no persisted session; auth is in memory for UI preview only.

## Customize

Edit [`src/config/admin.config.ts`](./src/config/admin.config.ts) to change:

- Brand name, tagline, and logo letter
- Login page copy and feature bullets
- Sidebar navigation links

## Project structure

```text
src/
├── app/admin/           # Admin routes (login + dashboard pages)
├── components/admin/    # Layout, dashboard widgets, shared UI
├── components/theme/    # Theme provider
├── config/              # Branding + navigation
├── context/             # Sidebar, chat panel state
└── lib/admin-api/       # Preview data + API stubs
```

## Copy into another project

1. Copy `src/app/admin`, `src/components/admin`, `src/components/theme`
2. Copy `src/config/admin.config.ts`, `src/context`, `src/lib/admin-api`, `src/lib/admin-data`, `src/lib/cn.ts`
3. Merge admin styles from `globals.css` / `admin.css` into your app styles
4. Wrap the root layout with `ThemeProvider`
5. Install peer deps: `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`

## Tech stack

| Package | Role |
| --- | --- |
| Next.js 16 | App Router |
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
