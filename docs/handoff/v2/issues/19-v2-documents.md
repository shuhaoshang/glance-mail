# 19 · Add the Visual 2.0 documents and references

**Label:** `chore` · **Depends on:** —

## Why
The redesign is specified in documents, data and reference pages that the designer prepared. They need to be in the repository before any code changes, so every later PR can point at them.

## Decisions already made
1. The files are provided as they should be committed. Do not reword, restructure or reformat their content.
2. The provided data and tokens stay in `docs/handoff/v2/provided/` for now. They move into `src/` in issues 20 and 24.

## What to build
- Commit, unchanged: `docs/decisions.md`, `docs/design-system.md`, `docs/design-rules.md`, `docs/product-brief.md`, `docs/user-flows.md`, `docs/data-model.md`, `docs/handoff/v2/**`, `docs/prototype/v2/**`, `docs/screens/v2/**`.
- In `AGENTS.md`, under “Where to start”, add one paragraph: handoff 2 lives in `docs/handoff/v2/`; work through its issues 19 to 32 in the order in its README. Add `docs/handoff/v2/README.md` to the documents table.
- Link `docs/prototype/v2/index.html` from `docs/prototype/index.html` as “Visual 2.0 reference states”.

## Acceptance criteria
- [ ] `npm run check:english` passes on the new files.
- [ ] `npm run build` still copies `docs/prototype/` (now including `v2/`) into `dist/prototype/`.
- [ ] No file under `src/` changes.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/handoff/v2/README.md`

## Out of scope
Any code or token change.
