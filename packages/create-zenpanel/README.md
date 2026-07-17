# create-zenpanel

Scaffold a ZenPanel admin app, or install the admin UI shell into an existing project.

Same dashboard design across **Next.js**, **React**, **Preact**, **Solid**, **Svelte**, **Vue**, **HTML**, **Astro**, and **Angular**.

## Quick start

```bash
npm create zenpanel@latest
```

Same convention as Vite (`npm create vite@latest`) — npm runs the `create-zenpanel` package. Equivalent: `npx create-zenpanel@latest`.

```bash
npm create zenpanel@latest my-admin -- --framework nextjs
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
npm create zenpanel@latest my-admin -- --framework nextjs
npm create zenpanel@latest my-admin -- --framework react
npm create zenpanel@latest my-admin -- --framework preact
npm create zenpanel@latest my-admin -- --framework solid
npm create zenpanel@latest my-admin -- --framework svelte
npm create zenpanel@latest my-admin -- --framework vue
npm create zenpanel@latest my-admin -- --framework html
npm create zenpanel@latest my-admin -- --framework astro
npm create zenpanel@latest my-admin -- --framework angular
```

`vite` is accepted as an alias for `react`.

## Install into an existing project

```bash
cd my-existing-app
npm create zenpanel@latest
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

Pass flags after `--` when using `npm create` (example: `npm create zenpanel@latest my-admin -- --framework react`).

## Why the package is named `create-zenpanel`

npm’s create shortcut maps `npm create <name>` → package `create-<name>`:

| You type | npm installs / runs |
| --- | --- |
| `npm create vite@latest` | `create-vite` |
| `npm create next-app@latest` | `create-next-app` |
| `npm create zenpanel@latest` | `create-zenpanel` |

So the published package name stays `create-zenpanel` (not `zenpanel`) — same pattern as Vite and Next.
