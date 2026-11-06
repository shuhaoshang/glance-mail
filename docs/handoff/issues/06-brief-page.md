# 06 · Brief page, desktop and phone, from persona data

**Label:** `feat` · **Depends on:** 05, 18

## Why
The core screen: one brief that fits one screen and reads in about 30 seconds.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §2 and §6.

1. **Until the full detail view exists (issue 08)**, desktop shows a header-only DetailPanel card matching `docs/screens/desktop-daniel.png`: surface fill, card radius, 24 top and 32 side/bottom padding; position, title, Person and minority AccountLabel, and the attributed request. No tabs, scene card, reasoning, or actions yet. Issue 08 adds these inside the same card. Selection is shown only where the detail panel is visible; phone and 600–959 layouts have no selected row or empty sheet.
2. **From 600 to 959 px** the page uses the phone layout in one column, at most `--content-narrow` (640) wide and centered.
3. Progress uses the `ProgressBar` from issue 18; rows use the states from issue 05.
4. Until issue 12, Set aside uses the static CollapsedGroup card with its count and breakdown, no separate section heading, no chevron, and no focusable control.
5. The optional per-account note starts with the moon icon.

## Tokens to add

| Token | Value |
|---|---|
| `--content-narrow` | `640px` |

## What to build
- Route `/?persona=maya|daniel|sarah` (default maya).
- Header: wordmark, avatar, date, greeting, coverage line, optional per-account note.
- Needs you (with “x of y done” progress), Good to know, Set aside card, done rows from `doneBefore`.
- Desktop (≥ 960): list column 416 + detail area. 600–959: one centered column. Phone: single column.
- Desktop selection updates the detail header and highlights its row; narrow layouts have no selected row. Items render in data order.

## Acceptance criteria
- [ ] Counts shown on screen match the data (coverage = needs + know + set aside + done).
- [ ] Layout matches `docs/screens/desktop-maya.png` and `docs/screens/phone-brief.png` within normal browser differences, and works at 768 px wide.
- [ ] Keyboard: Tab reaches every row; Enter selects on desktop. Narrow layouts do not gain a selected row or an empty sheet.
- [ ] No control looks actionable without doing anything.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/product-brief.md` §8, `docs/design-rules.md` §2, §9–11, `docs/design-system.md` §6

## Out of scope
Detail tabs and body content, lifecycle actions, demo bar.
