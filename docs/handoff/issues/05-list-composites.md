# 05 · List composites: BriefRow, SectionCard, KnowRow, CollapsedGroup, DoneRow, NewMailRow

**Label:** `ds` · **Depends on:** 04

## Why
The brief is made of these rows; they must be identical for every item so the list scans quickly.

## What to build
- `BriefRow`: rank, name, optional AccountLabel and Badge, a request of up to two lines (✦ for summaries), up to 2 FactChips (urgent first). States: default, hover, selected, leaving (collapse), new.
- `SectionCard` with header slot (title, count, right-side content).
- `KnowRow` with icon tile, one underlined fact value (`fact.value` in `text`) that opens its SourcePanel inline, optional AccountLabel, optional ✦ judgment pill that expands a reason inline, and “Moved by you”.
- `CollapsedGroup` (set aside card), `DoneRow` (done, snoozed or moved to Set aside, with Undo), `NewMailRow`.

## Acceptance criteria
- [ ] One `BriefRow` renders every item type from all three personas without special cases.
- [ ] The request shows up to two lines on desktop and phone, then an ellipsis.
- [ ] Every Good to know fact opens its source, and only one KnowRow panel is open at a time.
- [ ] Matches `docs/screens/desktop-*.png` (left column) and `docs/screens/phone-brief.png`.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §4

## Out of scope
Page layout (issue 06).
