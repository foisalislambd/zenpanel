# ZenPanel

Reusable **Next.js admin panel** cloned from a production portfolio CMS. Use it as a standalone starter or copy `src/app/admin`, `src/components/admin`, `src/config`, `src/lib/admin-api`, and `src/context` into any Next.js project.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Demo login

| Field    | Value              |
| -------- | ------------------ |
| Username | `admin`            |
| Email    | `admin@zenpanel.dev` |
| Password | `demo1234`         |

Demo mode stores the session in `localStorage` — no backend required.

## Routes

| Path | Description |
| ---- | ----------- |
| `/admin` | Dashboard (stats + recent users) |
| `/admin/login` | Sign in |
| `/admin/projects` … `/admin/settings` | CMS sections (demo data) |

## Connect a real API

1. Copy `.env.example` → `.env.local`
2. Set your backend URL:

```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:4000
```

3. Implement these routes on your API (cookie-based session, same as portfolio backend):

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/me`
- `GET /api/admin/stats`
- `GET /api/admin/users`

Extend `src/lib/admin-api/client.ts` for additional resources (projects, blog, etc.).

## Customize per project

Edit **`src/config/admin.config.ts`**:

- `brand.name`, `brand.tagline`, `brand.letter`, `brand.siteUrl`
- `demo.credentials` (demo login)
- `adminNavItems` (sidebar menu)

## Project structure

```
src/
├── app/admin/           # App Router: /admin routes
├── components/admin/    # UI: auth, layout, dashboard, shared
├── config/admin.config.ts
├── context/admin-sidebar-context.tsx
└── lib/admin-api/       # Demo + HTTP client
```

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- next-themes (dark mode)
- lucide-react

## Reuse in another repo

1. Copy the folders listed above into your Next.js `src/`
2. Merge `globals.css` brand colors (or import a shared theme)
3. Add `ThemeProvider` to your root layout if missing
4. Install: `lucide-react clsx tailwind-merge next-themes`
5. Adjust `admin.config.ts` for your product

## License

Private / use per your team policy.
