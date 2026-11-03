# 06 · Brief page, desktop and phone, from persona data

**Label:** `feat` · **Depends on:** 05

## Why
The core screen: one brief that fits one screen and reads in about 30 seconds.

## What to build
- Route `/?persona=maya|daniel|sarah` (default maya).
- Header: wordmark, avatar, date, greeting, coverage line, optional per-account note.
- Needs you (with “x of y done” progress), Good to know, Set aside card, done rows from `doneBefore`.
- Desktop (≥ 960): list column 416 + detail area. Phone: single column; tapping a row opens the detail sheet (issue 08 fills it).
- Selecting a row highlights it; items render in data order.

## Acceptance criteria
- [ ] Counts shown on screen match the data (coverage = needs + know + set aside + done).
- [ ] Layout matches `docs/screens/desktop-maya.png` and `docs/screens/phone-brief.png` within normal browser differences.
- [ ] Keyboard: Tab reaches every row; Enter selects.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/product-brief.md` §8, `docs/design-rules.md` §2, §9–11

## Out of scope
Detail content, lifecycle actions, demo bar.
