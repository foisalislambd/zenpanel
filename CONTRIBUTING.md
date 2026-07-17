# Contributing to ZenPanel

Thanks for your interest in contributing. This guide keeps changes focused and reviewable.

## Ways to help

- Report bugs and propose features via [GitHub Issues](https://github.com/Foisalislambd/zenpanel/issues)
- Improve docs or accessibility
- Fix UI bugs or polish existing admin screens in the templates
- Extend `create-zenpanel` (new frameworks, better install detection)
- Add small, well-scoped features that fit the shell (no backend required)

## Repository layout

- `packages/create-zenpanel` — CLI published as `create-zenpanel`
- `packages/create-zenpanel/templates/nextjs` — Next.js template
- `packages/create-zenpanel/templates/react` — React + Vite template
- `packages/create-zenpanel/templates/preact` — Preact + Vite template
- `packages/create-zenpanel/templates/solid` — Solid + Vite template
- `packages/create-zenpanel/templates/svelte` — Svelte 5 + Vite template
- `packages/create-zenpanel/templates/vue` — Vue 3 + Vite template
- `packages/create-zenpanel/templates/html` — Plain HTML / CSS / JS template
- `packages/create-zenpanel/templates/astro` — Astro 7 template
- `packages/create-zenpanel/templates/angular` — Angular 22 + Tailwind (Next.js UI)

## Development setup

```bash
git clone https://github.com/Foisalislambd/zenpanel.git
cd zenpanel
npm install
npm run build
```

### Try the CLI locally

```bash
node packages/create-zenpanel/dist/index.js my-test-app --framework nextjs --skip-install
```

### Work on a template

```bash
cd packages/create-zenpanel/templates/nextjs
npm install
npm run dev
```

Or for React (Vite):

```bash
cd packages/create-zenpanel/templates/react
npm install
npm run dev
```

Or for Preact (Vite):

```bash
cd packages/create-zenpanel/templates/preact
npm install
npm run dev
```

Or for Solid (Vite):

```bash
cd packages/create-zenpanel/templates/solid
npm install
npm run dev
```

Or for Svelte (Vite):

```bash
cd packages/create-zenpanel/templates/svelte
npm install
npm run dev
```

Or for Vue (Vite):

```bash
cd packages/create-zenpanel/templates/vue
npm install
npm run dev
```

Or for Astro:

```bash
cd packages/create-zenpanel/templates/astro
npm install
npm run dev
```

Or for Angular:

```bash
cd packages/create-zenpanel/templates/angular
npm install
npm run dev
```

Preview login: `admin` / `admin` at `/admin/login`.

## Before you open a PR

1. Create a branch from `main` (`feat/...`, `fix/...`, or `docs/...`)
2. Keep the diff focused — one concern per PR
3. Match existing patterns in the template admin components and `admin.config.ts`
4. Run checks locally:

```bash
npm run build
```

For template UI changes, also run `npm run build` inside the template you changed.

5. Update the README if your change affects setup or customization

## Pull request checklist

- [ ] Describes the problem and the approach
- [ ] Includes screenshots for UI changes
- [ ] Does not add secrets, `.env` files, or unrelated refactors
- [ ] CLI build (and template build when relevant) pass

## Code guidelines

- Prefer small, readable components over large one-off pages
- Reuse shared admin UI (`resource-list`, layout pieces, empty/loading states)
- Keep branding and nav configurable via `admin.config.ts`
- Do not introduce a real backend or auth provider unless discussed in an issue first — this project is a UI shell with preview data
- Keep Next.js and React templates in sync when changing shared admin UX

## Reporting bugs

Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser / OS
- Framework (Next.js / React / Preact / Solid / Svelte / Vue / HTML / Astro / Angular / install-into-existing)
- Screenshot or short recording when relevant

## Questions

Open an issue with the `question` label, or start a discussion on the related PR.
