# AGENTS.md

Instructions for AI coding agents (Codex and others) working in this repository.
Read this file fully before starting any task.

## Project overview

**Glance** is a front-end demo of an AI-powered email client.

Most AI products answer with long blocks of text, and people spend more time reading the AI's output than they saved by using it. Glance explores a different approach: AI output is presented through **design-system components** chosen by explicit rules, so people can understand it at a glance.

The project has two equal goals:

1. **The product**: an email client UI with AI features.
2. **The process**: a visible, real-world workflow where AI agents open pull requests and a human Design Engineer reviews them against a code-based design system.

## Product decisions belong to the designer

The product brief lives in `docs/product-brief.md`. Read it before any task that touches product screens, data, components or copy. It is a living document and may change.

- Do not make product decisions on your own: features, screens, user flows, content or AI behavior.
- If a task requires a product decision that is not documented, do not guess. List it under **Open questions** in the PR description.

## Scope

- **Front-end only.** No backend, no database, no authentication.
- **Mock data only.** All data lives in static files in `src/data/`.
- **No real AI calls.** Any "AI output" is pre-written mock data. Do not add API keys or network requests.

## Tech stack

- React + TypeScript, built with Vite
- Styling: plain CSS with CSS Modules; all design values come from CSS custom properties (design tokens)
- Storybook for documenting the design system
- ESLint + Prettier
- GitHub Actions for build checks
- GitHub Pages for deployment

Do not add other libraries (UI kits, CSS frameworks, state libraries) without stating the reason in the PR description.

## Repository structure

```
src/
  design-system/
    tokens/          # tokens.css: colors, spacing, type, radius, shadow, motion
    components/      # one folder per component: Component.tsx, Component.module.css, Component.stories.tsx
  app/               # product screens, built only from design-system components
  data/              # mock data
docs/                # product and design documentation
```

## Design system rules (strict)

1. **Use tokens for every design value.** No raw hex colors, no raw px values for spacing, font size, radius or shadow. Use `var(--token-name)`. If a needed token does not exist, stop and say so in the PR; do not invent one inline.
2. **Product screens use only design-system components.** Code in `src/app/` must not define its own buttons, cards, inputs, etc.
3. **Missing component? Separate PR first.** If a feature needs a component the design system does not have:
   - Do not build it inside the feature PR.
   - Open a separate PR that adds the component to `src/design-system/components/` with Storybook stories for all its states.
   - The feature PR waits until the component PR is reviewed and merged.
4. **Every component has stories** for all meaningful states: default, hover, focus, disabled, loading, empty, error (as applicable).
5. **Accessibility is part of done**: semantic HTML, visible focus states, keyboard support, WCAG AA color contrast, labels for icon-only buttons.

## Git workflow

- **Never commit directly to `main`.** All changes go through a pull request.
- **Branch names**: `feat/<short-name>`, `ds/<component-name>` (design-system additions), `fix/<short-name>`, `docs/<short-name>`, `chore/<short-name>`.
- **One concern per PR.** Keep PRs small enough to review in about 10 minutes.
- **Commit messages** follow Conventional Commits, e.g. `feat(ds): add Badge component`.
- **PR description** must include:
  - **What**: what changed, in plain language
  - **Why**: the problem it solves
  - **Design system impact**: tokens or components added or changed (or "none")
  - **Screenshots**: before/after for any visual change
  - **How to review**: what the reviewer should look at first
  - **Open questions**: anything you were unsure about, including any product decision you needed

The human reviewer is a designer. Write PR descriptions for a designer, not only for an engineer.

## Definition of done

- `npm run build` and `npm run lint` pass
- Storybook builds, and new or changed components have stories
- No raw design values outside `tokens.css`
- PR description is complete
