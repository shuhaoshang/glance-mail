# 32 · Flows, screenshots and cleanup

**Label:** `chore` · **Depends on:** 27, 29, 31

## Why
The flows are the acceptance test, and the repository should not carry the old view's leftovers.

## Decisions already made
1. Edge-state stories keep their current layout; do not touch them beyond keeping them building.

## What to build
- Playwright: every Given / When / Then in `docs/user-flows.md` “Visual 2.0” has a test, for the personas it names, on desktop and phone.
- Remove `setAside` from the persona JSON and from `types.ts` and `check-data`, and delete `SetAsideList`. Keep `SectionCard` and `CollapsedGroup` only if an edge-state story imports them.
- Regenerate `docs/screens/*.png` with the existing script where the screen still exists; delete images of removed screens (`desktop-setaside.png`).
- README: update the feature list and the status to Visual 2.0; link `docs/prototype/v2/index.html`.
- A final pass in both themes at 1280, 1024 and 390: list every visual difference from `docs/screens/v2/` that remains and why.

## Acceptance criteria
- [ ] All flow tests pass on CI.
- [ ] `rg -i "set aside|good to know" src` finds nothing outside edge-state stories and their data.
- [ ] Storybook has no story for a deleted component.
- [ ] The deployed site matches the reference images for the three personas.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/user-flows.md` “Visual 2.0” · all of `docs/screens/v2/`

## Out of scope
Edge states under tabs; new step images for the flows.
