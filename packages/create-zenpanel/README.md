# create-zenpanel

Scaffold a ZenPanel admin app, or install the admin UI shell into an existing project.

## Usage

### Create a new project

```bash
npx create-zenpanel@latest
```

You will be prompted for:

1. Project name
2. Framework — **Next.js**, **React**, **Preact**, **Solid**, **Svelte**, **Vue**, **HTML**, **Astro**, **Angular** (Remix coming soon)

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

### Install into an existing project

If the current directory already has a `package.json`, the CLI installs the admin panel into that project:

```bash
cd my-existing-app
npx create-zenpanel@latest
```

Or force install mode:

```bash
npx create-zenpanel@latest --install
```

## Options

| Flag | Description |
| --- | --- |
| `-f, --framework <name>` | `nextjs`, `react`, `preact`, `solid`, `svelte`, `vue`, `html`, `astro`, or `angular` (`vite` → `react`) |
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

Username / password: `admin` / `admin`
