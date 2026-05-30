# Claude Code — Interactive Setup Guide

A Vite + React + TypeScript SPA that walks engineers through Claude Code setup, key concepts, and safe usage patterns. More digestible than a PDF — sections are tabbed, all code snippets are copy-able.

## Sections

1. **Install** — npm install, authenticate, verify
2. **First Session** — what to try first, key shortcuts
3. **CLAUDE.md** — standing instructions, locations, template
4. **Skills** — slash commands, how to build them
5. **Safety & Data** — what Claude can see, data classification rules
6. **Cost & Limits** — pricing tiers, cost control, cost tracker hook

## Run locally

```bash
npm install
npm run dev
```

## Build for static deployment

```bash
npm run build
```

Output goes to `dist/` — deployable to any static host (Vercel, Netlify, S3, SharePoint, internal web server).

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS for styling
- Zero backend, zero external dependencies at runtime
