# AI Coding Assistants: Field Guide

An interactive Vite + React + TypeScript guide to AI coding assistants. It opens on a vendor-neutral splash screen, helps you pick a tool by need, and covers safe, responsible use. It also goes deep on Claude Code and has a profile for each major assistant.

> **Professional use:** if you use an AI coding assistant for work, check with your IT or security team first. It is your responsibility to follow your organization's rules. This guide is general information, not legal, security, or compliance advice.

## What is in it

**Splash screen.** What a coding assistant is, what using one means, the landscape (listed alphabetically), what to look for, and the IT disclaimer.

**Start here** (tool-neutral)
- **Pick Your Tool:** an interactive picker (tick your needs, see ranked fits), a need-to-tool rubric, and a scoring sheet for your own shortlist.
- **Compare Them All:** a side-by-side table and the rules that apply to every tool.
- **More Assistants:** Amazon Q Developer, Kiro, Cline, Continue, and Zed.
- **IT Review Checklist:** questions to bring to your IT team.
- **Using AI Responsibly:** the risks in plain English, for juniors and non-developers.
- **Safeguards:** secrets, blast radius, verifying AI-written code, prompt injection.
- **Saving Money (Any Tool):** how each tool charges and habits that save money.

**Claude Code deep dive.** Install, first session, models (current and older, with status), CLAUDE.md and the other `.md` files, skills, MCP and plugins, plans and permission modes, safety and data, and cost.

**Assistant profiles.** Claude Code, GitHub Copilot, Cursor, Windsurf (Devin Desktop), OpenAI Codex, Gemini CLI, and Aider. Each has what it is, how to start, how to use it, pros and cons, and a safety tip.

## Run locally

```bash
npm install
npm run dev
```

## Build for static deployment

```bash
npm run build
```

Output goes to `dist/`. It is deployable to any static host (Vercel, Netlify, S3, SharePoint, an internal web server).

## Design

- Courier Prime throughout, with a developer look: file-tree sidebar, line-numbered code blocks, `//` notes, and a status bar.
- Light and dark themes follow the system setting (`prefers-color-scheme`). Text colors meet WCAG AA contrast in both.
- Every page has a deep link, for example `#/it-review`. Back and forward work.
- The layout adapts to phone width, and animations respect reduced-motion settings.

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS 3 (with PostCSS)
- No backend. The one external runtime request is the Courier Prime font from Google Fonts. To run fully offline, self-host the font and remove the `<link>` tags in `index.html`.

## Editing the content

All text lives in `src/content.ts`. Add a page by adding a section object and listing its `id` in the `pickIds(...)` group at the bottom. The UI is in `src/App.tsx`.

## Sources and freshness

Tool details, model IDs, prices, and model status come from each vendor's own docs and were read on **2 Oct 2026**. This space changes fast. Re-check the vendor pages before relying on a price, a plan, or a model's availability. Where a detail could not be confirmed from the docs, the guide says so or leaves it out.
