# Publish `create-zenpanel` to npm

This monorepo publishes the CLI package at `packages/create-zenpanel`.

## Automated release (recommended)

Push to `main` after bumping the package version. CI must pass first; only then Release publishes and creates a GitHub tag/release.

1. Bump `version` in `packages/create-zenpanel/package.json` (and update `CHANGELOG.md`).
2. Push to `main`.
3. **CI** builds the CLI and every template.
4. If CI succeeds, **Release** (`.github/workflows/release.yml`):
   - Publishes `create-zenpanel` to **npmjs.com** via [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/) (OIDC — no `NPM_TOKEN`)
   - Publishes `@foisalislambd/create-zenpanel` to **GitHub Packages**
   - Creates a GitHub Release + tag `vX.Y.Z`
5. If CI fails, nothing is published and no release/tag is created.
6. If that version/tag already exists, Release skips (safe to push non-release commits).

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
