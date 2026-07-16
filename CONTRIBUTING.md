# Contributing to ZenPanel

Thanks for your interest in contributing. This guide keeps changes focused and reviewable.

## Ways to help

- Report bugs and propose features via [GitHub Issues](https://github.com/Foisalislambd/zenpanel/issues)
- Improve docs or accessibility
- Fix UI bugs or polish existing admin screens
- Add small, well-scoped features that fit the shell (no backend required)

## Development setup

```bash
git clone https://github.com/Foisalislambd/zenpanel.git
cd zenpanel
npm install
npm run dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login). Preview login: `admin` / `admin`.

## Before you open a PR

1. Create a branch from `main` (`feat/...`, `fix/...`, or `docs/...`)
2. Keep the diff focused — one concern per PR
3. Match existing patterns in `src/components/admin` and `src/config/admin.config.ts`
4. Run checks locally:

```bash
npm run lint
npm run build
```

5. Update the README if your change affects setup or customization

## Pull request checklist

- [ ] Describes the problem and the approach
- [ ] Includes screenshots for UI changes
- [ ] Does not add secrets, `.env` files, or unrelated refactors
- [ ] Lint and build pass

## Code guidelines

- Prefer small, readable components over large one-off pages
- Reuse shared admin UI (`resource-list`, layout pieces, empty/loading states)
- Keep branding and nav configurable via `admin.config.ts`
- Do not introduce a real backend or auth provider unless discussed in an issue first — this project is a UI shell with preview data

## Reporting bugs

Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser / OS
- Screenshot or short recording when relevant

## Questions

Open an issue with the `question` label, or start a discussion on the related PR.
