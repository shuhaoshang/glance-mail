# 18 · Remaining primitives: DateTile, Checkbox, Switch, ProgressBar and the outline Button

**Label:** `ds` · **Depends on:** 05 · **Do it right after 05**, before 06.

## Why
Screens must be built only from design-system components (`AGENTS.md`). The brief page needs ProgressBar, scene cards need DateTile and Checkbox, the detail view needs Switch and an outline Button. Building them first keeps every feature PR free of one-off components (D42).

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §2–3.

1. **Checkbox hit area is 44** (D46). The box stays 24 (`--size-checkbox`); the hit area grows to `--size-touch`.
2. **Checkbox states:** unchecked hover `--color-sunken-hover`, pressed `--color-sunken-pressed`; checked hover `--color-brand-hover`, pressed `--color-brand-pressed`.
3. **Switch states:** on hover `--color-brand-hover`; off hover `--color-text-muted`. The knob slides over `--duration-fast`. Hit area 44, including the visible label.
4. **Outline Button:** a new `outline` variant: `--color-surface` fill, `--border-hairline` inset ring in `--color-border-strong`, `--color-text`, 14/20 medium, `compact` height 40. Hover `--color-sunken-hover`, pressed `--color-sunken-pressed`; the ring stays.
5. **ProgressBar** is decorative; the text next to it is the live region.
6. **SourcePanel header:** align the first line of the sender and date with “Open email” by baseline (`align-items: first baseline`), on one line or several.
7. **No outlines for state** (D43). Only `:focus-visible` draws an outline.

## Tokens to add

| Token | Value |
|---|---|
| `--size-checkbox` | `24px` |
| `--size-switch-track-width` | `36px` |
| `--size-switch-track-height` | `20px` |
| `--size-switch-knob` | `16px` |
| `--size-progress` | `4px` |

## What to build
- `DateTile` (56 × 56: month 12/16 in `--color-time-text`, day 24/28 bold).
- `Checkbox` with label slot (inline Fields allowed in the label), checked and unchecked, and a struck-through style for completed checklists where inline fact values stay readable and tappable.
- `Switch` with a visible label.
- `ProgressBar` with a value from 0 to 1.
- `Button` variant `outline`.
- The SourcePanel header alignment fix.

## Acceptance criteria
- [ ] Each component has stories for every state that applies (default, hover, pressed, focus-visible, checked, disabled), in both themes.
- [ ] Checkbox and Switch hit areas are at least 44 × 44 without changing their visible size.
- [ ] The SourcePanel story shows the header aligned on one line and when wrapped.
- [ ] The five new tokens exist; no raw hex, px or ms values outside `tokens.css`.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §2–3, `docs/design-rules.md` §11 and §13, `docs/screens/ds-components.png`

## Out of scope
Scene cards (07), Notice and Skeleton (13).
