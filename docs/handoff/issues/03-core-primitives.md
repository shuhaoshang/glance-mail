# 03 · Core primitives: Button, IconButton, SegmentedControl, labels and Person

**Label:** `ds` · **Depends on:** 02

## Why
These primitives appear on every screen.

## What to build
- `Button` (primary, tint, neutral, text; default 48 and compact 40; optional icon; external link variant).
- `IconButton` (44 hit area, required `aria-label`).
- `SegmentedControl` (tablist semantics, arrow keys).
- `AccountLabel` (outlined), `Badge` (New), `GlanceMark` (✦ with optional “Glance’s summary · not the sender’s words”).
- `Person` (24 avatar with initial, name, role) and `Avatar` (32).

## Acceptance criteria
- [ ] Stories cover default, hover, focus-visible, pressed and disabled where they apply, in both themes.
- [ ] Focus is visible on every interactive primitive.
- [ ] Matches `docs/screens/ds-components.png` (Primitives section).
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §3

## Out of scope
Fact chips, fields and highlights (issue 04).
