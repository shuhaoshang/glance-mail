# 24 · Data version 2

**Label:** `feat` · **Depends on:** 19

## Why
Other mail, Watchlist, Memory and the Heads-up details need content. The designer wrote it; this issue brings it in with matching types and checks.

## Decisions already made
1. The data and types are provided. Do not change any copy.
2. `setAside` stays in the data until issue 32 so the current Set aside view keeps working while the tabs are built.
3. `goodToKnow` keeps its key; it is shown as Heads-up.

## What to build
- Copy `docs/handoff/v2/provided/data/*.json` over `src/data/` and `provided/types.ts` over `src/data/types.ts`; run the formatter on `types.ts` only.
- Extend `scripts/check-data.mjs` with the rules in `docs/data-model.md` “Version 2”.
- Update code that reads the renamed `demo.levels.l2.otherMail`, and the visible words in the level 2 view: “Good to know” becomes “Heads-up”, “Set aside” becomes “Other mail”.
- The new-mail row text now comes out as “2 new added: 1 here, 1 in Other mail”; update the flow test that reads it.

## Acceptance criteria
- [ ] `npm run check:data` passes and fails when any Version 2 rule is broken (show one failing example per rule in the PR description, not in the repo).
- [ ] The app looks and behaves as before this PR except for the two renamed words in level 2 and the new-mail text.
- [ ] No JSON copy differs from the provided files (`git diff --no-index` against `provided/` is empty).
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/data-model.md` “Version 2”

## Out of scope
Showing any of the new data.
