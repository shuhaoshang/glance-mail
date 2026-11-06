# AGENTS.md

Instructions for AI coding agents (Codex and others) working in this repository.
Read this file fully before starting any task.

## Project overview

**Glance** is a front-end demo of an **AI briefing layer on top of email**. It is not an email client: Glance reads the user's inboxes and briefs them; replying and composing stay in Gmail, Outlook or Yahoo Mail.

Most AI summaries are a block of text people can't verify, so they read the original anyway. Glance's thesis is **“Components make it fast. Sources make it trustworthy.”**: facts are shown through design-system components chosen by explicit rules, and every fact can show the exact sentence it came from.

The project has two equal goals:

1. **The product**: a responsive web app (desktop and phone) showing a morning brief for three personas.
2. **The process**: a visible, real-world workflow where AI agents open pull requests and a human Design Engineer reviews them against a code-based design system.

## Product decisions belong to the designer

Read these before any task that touches screens, data, components or copy. They are living documents and may change:

| Document                           | What it answers                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `docs/product-brief.md`            | What Glance is, for whom, and what is in scope                                   |
| `docs/user-flows.md`               | Each persona’s story, step by step, with Given / When / Then acceptance criteria |
| `docs/design-rules.md`             | The rules: color meaning, the 4 px grid, sourcing, accounts, edge states        |
| `docs/design-system.md`            | Every component, its props and states, and which scene card to use when          |
| `docs/data-model.md`               | The shape of the mock data in `src/data/`                                        |
| `docs/decisions.md`                | Why things are the way they are (read it before proposing to change one)         |
| `docs/screens/`, `docs/prototype/` | What the result should look like; prototypes open in a browser and are clickable |

If the screens and the documents disagree, the documents win. Note the difference under **Open questions** in the PR.

- Do not make product decisions on your own: features, screens, user flows, content or AI behavior.
- If a task requires a product decision that is not documented, do not guess. List it under **Open questions** in the PR description.

## Scope

- **Front-end only.** No backend, no database, no authentication.
- **Mock data only.** All data lives in `src/data/*.json` (one file per persona). It is designer-owned content: do not reword copy, especially quotes, which are the sender's exact words. Add TypeScript types in `src/data/types.ts` that follow `docs/data-model.md`.
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
    tokens/          # tokens.css (provided by design): colors light and dark, type, spacing, radius, motion
    components/      # one folder per component: Component.tsx, Component.module.css, Component.stories.tsx
  app/               # product screens, built only from design-system components
  data/              # maya.json, daniel.json, sarah.json (provided by design) + types.ts
docs/
  product-brief.md, design-rules.md, design-system.md, data-model.md, decisions.md
  screens/           # reference screenshots
  prototype/         # clickable HTML prototypes (open in a browser)
  handoff/           # work order and issue texts
```

## Design system rules (strict)

0. **Tokens are provided by design** in `src/design-system/tokens/tokens.css`, with light and dark values. Do not change existing values. If you need a new token, propose it in a separate `ds/` PR and explain why.
1. **Use tokens for every design value.** No raw hex colors, no raw px values for spacing, font size, radius or shadow. Use `var(--token-name)`. If a needed token does not exist, stop and say so in the PR; do not invent one inline.
2. **Product screens use only design-system components.** Code in `src/app/` must not define its own buttons, cards, inputs, etc.
3. **Missing component? Separate PR first.** If a feature needs a component the design system does not have:
   - Do not build it inside the feature PR.
   - Open a separate PR that adds the component to `src/design-system/components/` with Storybook stories for all its states.
   - The feature PR waits until the component PR is reviewed and merged.
4. **Every component has stories** for all meaningful states: default, hover, focus, disabled, loading, empty, error (as applicable).
5. **Accessibility is part of done**: semantic HTML, visible focus states, keyboard support, WCAG AA color contrast, labels for icon-only buttons.
6. **State tokens, never invented states (D43).** Hover, pressed, and disabled styling use the documented state tokens. If the specification does not define a state, do not invent it; put a concrete proposal under **Open questions** in the PR and wait for the designer to confirm it.

## Product rules that are easy to get wrong

- **Two kinds of content.** Quotes (in “ ”) are the sender's words. Anything Glance wrote is marked with ✦ and never put in quotes.
- **Lists are uniform, details are specific.** Every item in a list uses `BriefRow`. The detail view uses the scene card named in `item.scene.type`; never infer the type yourself. No scene → text fallback.
- **Render items in data order.** They are already ranked; do not re-sort.
- **One primary button per view.**
- **No dead controls.** If something can't act yet, render plain text, not a button.
- **Nothing reshuffles while the user reads.** New mail waits in a “2 new · Add to brief” row.

## Language

- **American English only, everywhere public.** Code, comments, docs, data, commit messages, branch names, and the titles, descriptions and comments of pull requests and issues use US spelling and vocabulary. This includes the product brief, prototypes, Storybook, the design system, screenshots, and review replies. Use forms such as “color,” “gray,” “behavior,” “labeled,” and “organization.” Preserve standard API names and verbatim source quotations.
- **Not a single Chinese character** (or any other CJK character) may appear in the repository or on GitHub. CI checks the files (issue 01); check PR and issue text (including comments) before posting. Run `npm run check:english` for tracked files or pipe a draft into `npm run --silent check:english -- --stdin`.
- Background notes you may be given outside the repository stay outside it. Never commit them or quote them.

## Authorship labels

The pull requests and comments Codex writes are published from the designer's GitHub account, so they must be recognizable as Codex's own.

- Start every pull request title and every comment, review reply and issue comment you write with `[Codex]`, for example `[Codex] feat(ds): add Storybook foundations`.
- This applies to new work and to existing open and closed pull requests: add the prefix to their titles and to your own earlier comments.
- Do not add the prefix to the designer's comments. Do not rewrite commit messages that are already merged.

## Git workflow

- **Never commit directly to `main`.** All changes go through a pull request.
- **Branch names**: `feat/<short-name>`, `ds/<component-name>` (design-system additions), `fix/<short-name>`, `docs/<short-name>`, `chore/<short-name>`.
- **One concern per PR.** Keep PRs small enough to review in about 10 minutes.
- **Commit messages** follow Conventional Commits, e.g. `feat(ds): add Badge component`.
- **Reply after review changes.** After making changes in response to review feedback, post a PR comment starting with `[Codex] ` that addresses each review point individually, explains how it was handled, and gives a reason for any suggestion not adopted.
- **PR description** must include:
  - **What**: what changed, in plain language
  - **Why**: the problem it solves
  - **Design system impact**: tokens or components added or changed (or "none")
  - **Screenshots**: before/after for any visual change
  - **How to review**: what the reviewer should look at first
  - **Open questions**: anything you were unsure about, including any product decision you needed

The human reviewer is a designer. Write PR descriptions for a designer, not only for an engineer.

## Where to start

Work through `docs/handoff/issues/` in the order given in `docs/handoff/README.md`: 01, 02, 17, 03, 04, 05, 18, 06, 11, 07, 08, 09, 10, 12, 13, 14, 15, 16. Each file is one GitHub issue with acceptance criteria. Do one issue per PR unless the issue says otherwise.

## Definition of done

- `npm run build` and `npm run lint` pass
- Storybook builds, and new or changed components have stories
- No raw design values outside `tokens.css`
- PR description is complete
