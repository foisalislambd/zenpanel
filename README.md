# ZenPanel

[![CI](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml/badge.svg)](https://github.com/Foisalislambd/zenpanel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Open-source **admin UI shell** for Next.js — sidebar, dashboard, resource tables, login, and dark mode.

No backend included. The dashboard shows sample preview data so you can review the UI; resource list pages start empty until you connect your API.

## Features

- Responsive admin layout (sidebar, header, breadcrumbs)
- Dashboard with stats, charts, and activity preview
- Resource list pages ready to wire to your API
- Login UI with preview auth (in-memory only)
- Light / dark theme via `next-themes`
- Configurable brand + navigation in one config file

## Quick start

```bash
git clone https://github.com/Foisalislambd/zenpanel.git
cd zenpanel
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Login is prefilled (`admin` / `admin`) — click **Sign in** to open the dashboard. No `.env` or persisted session — auth lives in memory for the UI preview only.

**Requirements:** Node.js 20+

## Customize

Edit `src/config/admin.config.ts` for brand name, tagline, and sidebar links.

## Copy into a project

Use `web-projects-script/scripts/sync-zenpanel-to-projects.py` to copy into product frontends, or manually:

1. `src/app/admin`, `src/components/admin`, `src/components/theme`
2. `src/config/admin.config.ts`, `src/context`, `src/lib/admin-api`, `src/lib/admin-data`, `src/lib/cn.ts`
3. Merge admin styles into `globals.css` (see script snippet)
4. Wrap root layout with `ThemeProvider`
5. Install: `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`

## Tech

Next.js 16 · React 19 · Tailwind 4 · next-themes · lucide-react

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).

- Bug reports & features: [Issues](https://github.com/Foisalislambd/zenpanel/issues)
- Security: [SECURITY.md](./SECURITY.md)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) © Foisal Islam
