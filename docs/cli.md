# CLI reference

Package: [`create-zenpanel`](https://www.npmjs.com/package/create-zenpanel)

## Usage

```bash
npx create-zenpanel@latest [project-name] [options]
```

Interactive prompts fill in anything you omit.

## Options

| Flag | Description |
| --- | --- |
| `-f, --framework <name>` | `nextjs`, `react`, `preact`, `solid`, `svelte`, `vue`, `html`, `astro`, `angular` |
| `--use-npm` / `--use-pnpm` / `--use-yarn` / `--use-bun` | Package manager |
| `--skip-install` | Skip installing dependencies |
| `--force` | Overwrite existing admin files (install mode) |
| `--install` | Force install-into-existing-project mode |

`vite` is accepted as an alias for `react`.

## Modes

### Create mode

Used when the target directory is empty / new. Copies a full framework template and installs deps (unless `--skip-install`).

### Install mode

Used when the current directory already has a `package.json`, or when you pass `--install`. Copies admin UI files into the existing app and merges peer dependencies where needed.

## Examples

```bash
npx create-zenpanel@latest my-admin --framework react --use-pnpm
npx create-zenpanel@latest my-admin --framework html --skip-install
cd existing-app && npx create-zenpanel@latest --install --framework nextjs
```

## Local development (monorepo)

From the ZenPanel repo root:

```bash
npm run build
node packages/create-zenpanel/dist/index.js my-test-app --framework nextjs
```
