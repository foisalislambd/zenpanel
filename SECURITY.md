# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a vulnerability

ZenPanel is a frontend admin UI shell with **preview-only auth** (no real backend or secrets by default). Even so, please report security issues privately when possible.

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead:

1. Email or message the maintainer via their [GitHub profile](https://github.com/Foisalislambd), **or**
2. Use [GitHub Security Advisories](https://github.com/Foisalislambd/zenpanel/security/advisories/new) if enabled on the repository

Include:

- A clear description of the issue
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You should receive an acknowledgment within a few days. We will work with you on a fix and coordinated disclosure when appropriate.

## Scope notes

Out of scope for this project’s default preview mode:

- Using the demo `admin` / `admin` credentials (they are intentional for UI preview)
- Issues that only appear after you wire your own production auth/API (report those against your integration unless the shell itself is at fault)
