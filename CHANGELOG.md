# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `create-zenpanel` CLI (`npx create-zenpanel@latest`)
- Framework selection: Next.js, React (Vite), Preact (Vite), HTML, and Astro 7 vanilla (Remix coming soon)
- Astro template based on latest `create-astro` (`astro@^7`, Node `>=22.12`) with plain HTML/CSS/JS admin
- React template folder renamed from `vite` → `react` (CLI still accepts `--framework vite` as an alias)
- Preact + Vite template based on latest `create-preact` / Vite Preact scaffold (`preact@^10`, `vite@^8`)
- Install-into-existing mode when `package.json` is already present
- Monorepo layout under `packages/create-zenpanel` with framework templates

### Changed

- Repository restructured like a scaffold monorepo (CLI + templates); root is no longer a single Next.js app

## [0.1.0] - 2026-07-16

### Added

- Admin UI shell for Next.js (sidebar, dashboard, resource tables, login, dark mode)
- Preview dashboard data and in-memory demo auth
- Configurable branding and navigation via `admin.config.ts`
- Open source project scaffolding (license, contributing guide, security policy, GitHub templates, CI)
