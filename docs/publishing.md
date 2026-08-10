# Publish `create-zenpanel` to npm

This monorepo publishes the CLI package at `packages/create-zenpanel`.

## Automated release (recommended)

Push to `main`. CI must pass first; only then Release publishes and creates a GitHub tag/release.

1. Push to `main` (no manual version bump needed).
2. **CI** builds the CLI and every template.
3. If CI succeeds, **Release** (`.github/workflows/release.yml`):
   - Auto-bumps `create-zenpanel` version
   - Publishes to **npmjs.com** via [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/) (OIDC — no `NPM_TOKEN`)
   - Publishes `@foisalislambd/create-zenpanel` to **GitHub Packages**
   - Commits the version bump with `[skip release]`, then creates a GitHub Release + tag `vX.Y.Z`
4. If CI fails, nothing is published and no release/tag is created.

### Skip a release

Put `[skip release]` in the **HEAD** commit message. CI still runs; npm / GitHub Packages / GitHub Release are skipped.

```bash
git commit -m "docs: fix typo [skip release]"
```

Note: the release bot also commits version bumps with `[skip release]`. Those bot pushes use `GITHUB_TOKEN`, so they do not re-trigger CI/Release (no loop).

### Version scheme

Starts at **2.0.0**. Each release increments the last digit; after `9` it rolls over:

`2.0.0` → `2.0.1` → … → `2.0.9` → `2.1.0` → … → `2.9.9` → `3.0.0`

Version is derived from existing `v*.*.*` git tags (not from editing `package.json` by hand).

### One-time: configure Trusted Publisher on npmjs.com

On [create-zenpanel → Settings → Trusted Publisher](https://www.npmjs.com/package/create-zenpanel):

| Field | Value |
| --- | --- |
| Organization or user | `foisalislambd` |
| Repository | `zenpanel` |
| Workflow filename | `release.yml` |
| Allowed actions | `npm publish` |

No GitHub secret `NPM_TOKEN` is required for npmjs publishes.

### Install from either registry

```bash
# npmjs.com (default — what users should use)
npm create zenpanel@latest

# GitHub Packages
npm install @foisalislambd/create-zenpanel --registry=https://npm.pkg.github.com
```

## Manual publish (fallback)

### Prerequisites

- npm account with publish rights
- Node.js 20+
- Clean git state (recommended)

### Checklist

1. **Build the CLI**

   ```bash
   npm run build -w create-zenpanel
   ```

2. **Confirm package metadata** in `packages/create-zenpanel/package.json`:
   - `name`: `create-zenpanel`
   - `version` bumped as needed
   - `bin`, `files` (`dist`, `templates`)
   - `repository` / `license`

3. **Dry-run the tarball**

   ```bash
   cd packages/create-zenpanel
   npm pack --dry-run
   ```

   Ensure `templates/**/node_modules` are **not** included (handled by `.npmignore`).

4. **Optional local install test**

   ```bash
   npm pack
   npx ./create-zenpanel-*.tgz my-smoke --framework html --skip-install
   ```

5. **Publish**

   ```bash
   npm login
   cd packages/create-zenpanel
   npm publish --access public
   ```

6. **Verify**

   ```bash
   npm view create-zenpanel version
   npm create zenpanel@latest -- --help
   npx create-zenpanel@latest --help
   ```

## Notes

- Root package `zenpanel` is `private: true` — only publish `create-zenpanel`.
- Package **must** stay named `create-zenpanel` on npmjs so `npm create zenpanel@latest` works (same as `create-vite` / `create-next-app`).
- GitHub Packages uses the scoped name `@foisalislambd/create-zenpanel` (required by the registry).
- Prefer letting the Release workflow create the git tag that matches the npm version.
