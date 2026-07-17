# Frameworks

All templates share the **same admin UI/UX** (Next.js is the visual source of truth). Pick the stack that matches your app.

| Framework | Tooling | Default port | Notes |
| --- | --- | --- | --- |
| **Next.js** | App Router, Tailwind 4 | `3000` | Canonical design reference |
| **React** | Vite 8 | `5173` | Same React admin UI as Next |
| **Preact** | Vite + `preact/compat` | `5173` | React-style code, Preact runtime |
| **Solid** | Vite + `@solidjs/router` | `5173` | Native Solid port |
| **Svelte** | Svelte 5 + Vite | `5173` | Native Svelte runes port |
| **Vue** | Vue 3 + `vue-router` | `5173` | Native Vue Composition API port |
| **HTML** | Plain HTML/CSS/JS + Tailwind CLI | `5173` | No Vite; static `serve` |
| **Astro** | Astro 7 + Tailwind Vite plugin | `4321` | Vanilla JS (same as HTML), MPA |
| **Angular** | Angular 22 + Tailwind | `4200` | Native Angular components |
| **Remix** | — | — | Coming soon |

## Which should I choose?

- **Already on Next.js** → `--framework nextjs`
- **Vite SPA** → `react`, `preact`, `solid`, `svelte`, or `vue`
- **No framework** → `html`
- **Content site + admin** → `astro`
- **Angular shop** → `angular`

## Parity notes

- Dashboard, login, shell, resources, messages, and settings are designed to match across frameworks.
- Preview auth is in-memory / `sessionStorage` only — wire real auth when you connect a backend.
- HTML and Astro use shared vanilla JS renderers; React-family templates share component structure with Next.
