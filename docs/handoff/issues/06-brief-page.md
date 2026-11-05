# 06 · Brief page, desktop and phone, from persona data

**Label:** `feat` · **Depends on:** 05, 18

## Why
The core screen: one brief that fits one screen and reads in about 30 seconds.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §2 and §6.

1. **Until the detail view exists (issue 08)**, the desktop detail area shows the selected item's name and request as plain text, with no buttons. On phone, tapping a row selects it and does not open an empty sheet. Issue 08 replaces both.
2. **From 600 to 959 px** the page uses the phone layout in one column, at most `--content-narrow` (640) wide and centered.
3. Progress uses the `ProgressBar` from issue 18; rows use the states from issue 05.

## Tokens to add

| Token | Value |
|---|---|
| `--content-narrow` | `640px` |

## What to build
- Route `/?persona=maya|daniel|sarah` (default maya).
- Header: wordmark, avatar, date, greeting, coverage line, optional per-account note.
- Needs you (with “x of y done” progress), Good to know, Set aside card, done rows from `doneBefore`.
- Desktop (≥ 960): list column 416 + detail area. 600–959: one centered column. Phone: single column.
- Selecting a row highlights it; items render in data order.

## Acceptance criteria
- [ ] Counts shown on screen match the data (coverage = needs + know + set aside + done).
- [ ] Layout matches `docs/screens/desktop-maya.png` and `docs/screens/phone-brief.png` within normal browser differences, and works at 768 px wide.
- [ ] Keyboard: Tab reaches every row; Enter selects.
- [ ] No control looks actionable without doing anything.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/product-brief.md` §8, `docs/design-rules.md` §2, §9–11, `docs/design-system.md` §6

## Out of scope
Detail content, lifecycle actions, demo bar.
