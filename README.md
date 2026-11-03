# Glance

**An AI briefing layer for email. Components make it fast. Sources make it trustworthy.**

AI email summaries were supposed to save time, but people can't check them, so they read the original anyway and then ask the AI again. Glance turns an inbox into a short morning brief instead:

- What **needs you**, ranked by urgency.
- What is **good to know**.
- What was **set aside**.

Every amount, date and name is a component you can scan, and one click on it shows the exact sentence it came from.

This repository is a **Design Engineer project**. It has two equal goals:

1. **The product:** a responsive web app (desktop and phone) for three personas.
   - Maya, in sales.
   - Daniel, a manager with two inboxes.
   - Sarah, a parent reading on her phone.
2. **The process:** the design system lives in code, and AI agents (Codex) build the app through pull requests. Each PR is reviewed against written design rules before it is merged.

## Where things are

|                                                          |                                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Product brief](docs/product-brief.md)                   | The problem, personas, principles and scope                                      |
| [User flows](docs/user-flows.md)                         | Each persona’s story, step by step on the real screens, with acceptance criteria |
| [Design rules](docs/design-rules.md)                     | The rules every screen follows                                                   |
| [Design system](docs/design-system.md)                   | Components, scene cards and patterns                                             |
| [Decision log](docs/decisions.md)                        | What was decided, what else was considered, and why                              |
| [Data model](docs/data-model.md)                         | The mock data in `src/data/`                                                     |
| [Screens](docs/screens/) · [Prototypes](docs/prototype/) | What the app should look like; the prototypes are clickable                      |
| [Handoff](docs/handoff/README.md)                        | The work order for AI agents                                                     |
| [AGENTS.md](AGENTS.md)                                   | Instructions every AI agent reads first                                          |

## Status

- **Design:** done. Ten rounds of iteration, three personas, desktop and phone, edge states, and a design system with light and dark tokens.
- **Build:** in progress, one reviewed pull request at a time.

Front-end only, with mock data: no real email access and no real AI calls.

## Run locally

Use Node.js 24 (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open the address printed by Vite, under `/glance-mail/`. The scaffold displays Glance and Maya's name.

```sh
npm run storybook
```

Storybook opens at `http://localhost:6006/`. The placeholder has Maya, Daniel and Sarah stories and a light/dark theme control.

## Checks and production build

```sh
npm run check:english
npm run lint
npm run build
npm run build-storybook
npm run format:check
```

The app build validates all three mock data files against `src/data/types.ts`, checks TypeScript, and copies the supplied HTML prototypes to `dist/prototype/`. Run `npm run check:data` to validate the data separately.

Use `npm run preview` to check the built app and prototypes locally.

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** once.

Pull requests run the Checks workflow. Pushes to `main` run Deploy Pages, which publishes the app at `/glance-mail/`, the design prototypes at `/glance-mail/prototype/`, and Storybook at `/glance-mail/storybook/`.
