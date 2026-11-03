# 07 · Scene cards: 8 types and the text fallback

**Label:** `ds` · **Depends on:** 04

## Why
Scene cards make the difference between formatted text and Glance visible: each email's facts in the shape of the email.

## What to build
- `SceneCard` that renders `item.scene` by `type`: deal, decision, approval, payment, mismatch, event, range, checklist; `text` (no card, underlined list of facts).
- Built only from primitives (Field, DateTile, Checkbox, FactChip for the urgent header).
- Checklist ticks are local state and do not mark the item done.

## Acceptance criteria
- [ ] A story per type using the real persona item that uses it (see the table in `docs/design-system.md` §5), plus one with a field selected and one in dark theme.
- [ ] Unknown or missing `scene` renders the text fallback.
- [ ] Matches `docs/screens/ds-components.png` (Scene cards section).
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §5

## Out of scope
Choosing a scene type in code. It always comes from the data.
