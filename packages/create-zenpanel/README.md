# create-zenpanel

Scaffold a ZenPanel admin app, or install the admin UI shell into an existing project.

## Usage

### Create a new project

```bash
npx create-zenpanel@latest
```

You will be prompted for:

1. Project name
2. Framework — **Next.js**, **Vite**, **HTML**, **Astro** (Remix coming soon)

```bash
npx create-zenpanel@latest my-admin --framework nextjs
npx create-zenpanel@latest my-admin --framework vite
npx create-zenpanel@latest my-admin --framework html
npx create-zenpanel@latest my-admin --framework astro
```

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
| `-f, --framework <name>` | `nextjs`, `vite`, `html`, or `astro` |
| `--use-npm` / `--use-pnpm` / `--use-yarn` / `--use-bun` | Package manager |
| `--skip-install` | Skip dependency installation |
| `--force` | Overwrite existing admin files (install mode) |
| `--install` | Force install-into-existing mode |

## Preview login

| Framework | URL |
| --- | --- |
| Next.js | `http://localhost:3000/admin/login` |
| Vite / HTML | `http://localhost:5173/admin/login` |
| Astro | `http://localhost:4321/admin/login` |

Username / password: `admin` / `admin`
