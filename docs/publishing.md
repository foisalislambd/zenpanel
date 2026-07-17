# Publish `create-zenpanel` to npm

This monorepo publishes the CLI package at `packages/create-zenpanel`.

## Prerequisites

- npm account with publish rights
- Node.js 20+
- Clean git state (recommended)

## Checklist

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
- Package **must** stay named `create-zenpanel` so `npm create zenpanel@latest` works (same as `create-vite` / `create-next-app`).
- First publish of a scoped-unscoped public package may need `--access public`.
- Prefer tagging a git release that matches the npm version.
