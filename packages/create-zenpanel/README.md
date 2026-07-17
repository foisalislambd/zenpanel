# create-zenpanel

Scaffold a ZenPanel admin app, or install the admin UI shell into an existing project.

Same dashboard design across **Next.js**, **React**, **Preact**, **Solid**, **Svelte**, **Vue**, **HTML**, **Astro**, and **Angular**.

## Quick start

```bash
npx create-zenpanel@latest
```

```bash
npx create-zenpanel@latest my-admin --framework nextjs
cd my-admin
npm run dev
```

Full guides: [ZenPanel docs](../../docs/README.md)

| Guide | Link |
| --- | --- |
| Getting started | [docs/getting-started.md](../../docs/getting-started.md) |
| CLI flags & modes | [docs/cli.md](../../docs/cli.md) |
| Frameworks | [docs/frameworks.md](../../docs/frameworks.md) |
| Customization | [docs/customization.md](../../docs/customization.md) |
| Theming | [docs/theming.md](../../docs/theming.md) |
| Connect your API | [docs/connecting-api.md](../../docs/connecting-api.md) |
| Publish this package | [docs/publishing.md](../../docs/publishing.md) |

## Create a new project

Prompts:

1. Project name  
2. Framework

```bash
npx create-zenpanel@latest my-admin --framework nextjs
npx create-zenpanel@latest my-admin --framework react
npx create-zenpanel@latest my-admin --framework preact
npx create-zenpanel@latest my-admin --framework solid
npx create-zenpanel@latest my-admin --framework svelte
npx create-zenpanel@latest my-admin --framework vue
npx create-zenpanel@latest my-admin --framework html
npx create-zenpanel@latest my-admin --framework astro
npx create-zenpanel@latest my-admin --framework angular
```

`vite` is accepted as an alias for `react`.

## Install into an existing project

```bash
cd my-existing-app
npx create-zenpanel@latest
# or
npx create-zenpanel@latest --install
```

## Options

| Flag | Description |
| --- | --- |
| `-f, --framework <name>` | `nextjs`, `react`, `preact`, `solid`, `svelte`, `vue`, `html`, `astro`, or `angular` |
| `--use-npm` / `--use-pnpm` / `--use-yarn` / `--use-bun` | Package manager |
| `--skip-install` | Skip dependency installation |
| `--force` | Overwrite existing admin files (install mode) |
| `--install` | Force install-into-existing mode |

## Preview login

| Framework | URL |
| --- | --- |
| Next.js | `http://localhost:3000/admin/login` |
| React / Preact / Solid / Svelte / Vue / HTML | `http://localhost:5173/admin/login` |
| Astro | `http://localhost:4321/admin/login` |
| Angular | `http://localhost:4200/admin/login` |

Username / password: **`admin` / `admin`**
