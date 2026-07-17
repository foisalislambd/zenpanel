# Connect your API

The scaffold includes **preview/sample data** so the dashboard and tables render without a backend.

## Where preview data lives

| Area | Typical location |
| --- | --- |
| Dashboard stats, chart, activity, orders, users | `src/lib/admin-api/preview.ts` (or HTML/Astro `data.js`) |
| AI chat mock replies | `src/lib/admin-api/chat.ts` |
| Empty resource lists | `src/lib/admin-data/resources.ts` |

## Recommended approach

1. Keep the UI components as-is.
2. Replace `previewFetch*` functions with `fetch` / your SDK against real endpoints.
3. Map API responses to the existing TypeScript types (`DashboardStats`, `RecentOrder`, `PortalUserRow`, etc.).
4. Wire auth so `AdminGuard` / login use your session, not `sessionStorage` demo login.
5. Enable search and “Add new” actions once the API supports them (many controls are intentionally disabled in preview).

## Environment variables

Add your own env files (e.g. `NEXT_PUBLIC_API_URL`, `VITE_API_URL`). ZenPanel does not ship a required `.env` for the preview UI.

## Production checklist

- [ ] Remove or gate demo credentials (`admin` / `admin`)
- [ ] Protect `/admin/*` with real auth
- [ ] Replace preview fetches with production APIs
- [ ] Review CORS / cookies for your hosting setup
