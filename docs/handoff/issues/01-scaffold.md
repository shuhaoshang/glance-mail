# 01 · Scaffold the app and deploy it to GitHub Pages

**Label:** `chore` · **Depends on:** —

## Why
Every later issue needs a working app, Storybook and a check that runs on each PR.

## What to build
- Vite + React + TypeScript app, CSS Modules, ESLint + Prettier, Storybook.
- Keep the design-provided files exactly where they are: `src/design-system/tokens/tokens.css` and `src/data/*.json`.
- Import `tokens.css` once at the app root and in Storybook's preview. Load Inter from Google Fonts (400, 500, 600, 700).
- Add `src/data/types.ts` from `docs/data-model.md`, and a loader that returns a persona by id.
- GitHub Actions: on every PR run `npm run build`, `npm run lint` and `npm run build-storybook`. On `main`, deploy the app to GitHub Pages (Storybook can be published under `/storybook/`).
- A placeholder page that shows the Glance wordmark and the persona name, so the deploy can be checked.
- Keep the design prototypes online: copy `docs/prototype/` into the Pages build so it is served at `/prototype/`.
- `npm run check:english`, run in CI: fail if any tracked file contains a CJK character (U+3000–U+303F, U+3400–U+4DBF, U+4E00–U+9FFF, U+FF00–U+FFEF). `AGENTS.md` § Language.

## Acceptance criteria
- [ ] `npm run dev`, `npm run build`, `npm run lint`, `npm run storybook` all work.
- [ ] CI runs on pull requests and fails if build, lint or Storybook fail.
- [ ] Merging to `main` publishes the site to GitHub Pages, with the prototypes at `/prototype/`.
- [ ] CI fails if any file contains a Chinese character.
- [ ] `tokens.css` and the JSON files are unchanged (diff shows no edits).
- [ ] `types.ts` type-checks all three persona files.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`AGENTS.md` (tech stack, structure), `docs/data-model.md`

## Out of scope
Any product UI beyond the placeholder.
