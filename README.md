# ZenPanel

**Admin UI / UX kit** — Next.js components and pages for previewing an admin dashboard.  
No backend, no database, no real save/delete.

Use this repo to:

- Review layout, sidebar, dark mode, tables, and login screen
- Copy `src/app/admin` + `src/components/admin` into another project
- Customize branding in `src/config/admin.config.ts`

When you build a real product later, that product gets its **own backend** and **own pages** — wire them separately; this repo stays a design reference.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Preview login

| Field    | Value                |
| -------- | -------------------- |
| Username | `admin`              |
| Email    | `admin@zenpanel.dev` |
| Password | `demo1234`           |

Session is stored in `localStorage` only so you can click through the UI.

## What is included

| Area | Notes |
| ---- | ----- |
| Layout | Sidebar, header, responsive shell |
| Dashboard | Sample stat cards + user table |
| Sections | Projects, blog, payments, etc. — **static sample rows** |
| Actions | Buttons show alerts — not functional |
| Settings | Branding notes + preview profile |

## What is NOT included

- API client or env-based API URL
- Create/edit forms that persist data
- Auth that hits a server

## Customize UI

`src/config/admin.config.ts`:

- `brand` — name, tagline, letter
- `adminNavItems` — sidebar links
- `previewLogin` — fake credentials

Sample table data: `src/lib/demo-data/resources.ts`  
Mock auth/session: `src/lib/admin-api/preview.ts`

## Copy into another project

1. Copy `src/app/admin`, `src/components/admin`, `src/config`, `src/context`, `src/lib/admin-api`, `src/lib/demo-data`
2. Merge admin styles from `src/app/admin/admin.css` and brand colors in `globals.css`
3. Install: `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`
4. In the **product** repo: add backend + real pages when ready

## Tech

Next.js 16 · React 19 · Tailwind 4 · next-themes · lucide-react
