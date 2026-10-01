# Publish `create-zenpanel` to npm

This monorepo publishes the CLI package at `packages/create-zenpanel`.

## Automated release (recommended)

Set the version in the root `package.json`, then push to `main`. CI must pass first. Release publishes only when that version is **strictly greater** than the latest GitHub Release.

1. Set `"version"` in the root `package.json` (for example `1.0.2`). Do not rely on an automatic bump.
2. Push to `main`.
3. **CI** builds the CLI and every template.
4. If CI succeeds, **Release** (`.github/workflows/release.yml`) reads the root `package.json` version and compares it to the highest `vX.Y.Z` GitHub Release:
   - **Greater** — publishes `create-zenpanel` at that version to **npmjs.com** via [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/) (OIDC — no `NPM_TOKEN`), publishes `@foisalislambd/create-zenpanel` to **GitHub Packages**, then creates a GitHub Release + tag `vX.Y.Z`
   - **Equal or lower** — nothing is published and no tag/release is created
5. If CI fails, nothing is published and no release/tag is created.
6. A commit message containing `[skip release]` also skips npm, GitHub Packages, and the GitHub Release. CI still runs.

The workflow copies the root version onto `packages/create-zenpanel` only in the publish job. It does not commit a version bump.

### Skip a release

Put `[skip release]` in the **HEAD** commit message.

```bash
git commit -m "docs: fix typo [skip release]"
```

### Version

The root `package.json` `"version"` is the release version (`X.Y.Z`). Raise it above the current GitHub Release before pushing when you want a new release. A lower or equal version does not publish.

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
   - `version` set to the same `X.Y.Z` as the root `package.json` (the Release workflow does this for you)
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
