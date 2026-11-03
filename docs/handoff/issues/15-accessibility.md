# 15 · Accessibility and polish pass

**Label:** `chore` · **Depends on:** 09, 10, 11, 12

## Why
Accessibility is part of done; this pass checks the whole app end to end.

## What to build
- Keyboard: every action reachable, visible focus, Escape closes sheets and panels, focus returns to the row.
- Screen readers: labels for icon buttons, fields, chips (“urgent” included), live region for progress and new mail.
- Reduced motion verified on every animation.
- Lighthouse accessibility score ≥ 95 on desktop and mobile.

## Acceptance criteria
- [ ] A short report in the PR: what was checked, what was fixed, what is left.
- [ ] Lighthouse screenshots attached.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §7

## Out of scope
New features.
