# 05 · List composites: BriefRow, SectionCard, KnowRow, CollapsedGroup, DoneRow, NewMailRow

**Label:** `ds` · **Depends on:** 04

## Why
The brief is made of these rows. They must be identical for every item so the list scans quickly, and every Good to know fact must open its source in one click.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §2–4; this list is a summary.

1. **Row states.** BriefRow and CollapsedGroup are buttons. Hover fills with `--color-row-hover`, pressed with `--color-row-pressed`. Selected fills with `--color-brand-tint`; selected and hovered uses `--color-brand-tint-hover`. Hover and pressed never add an outline; the outline is for keyboard focus only.
2. **Enter motion.** Rows that appear (a new BriefRow, a DoneRow) fade down over `--duration-enter` (240 ms), moving `--space-4`.
3. **New state.** A new BriefRow shows the `New` Badge and enters with the enter motion.
4. **ReasonPill.** A new primitive for ✦ judgments (spec in `docs/design-system.md` §3), in two sizes: `small` for KnowRow (visible height 24, hit area at least 44, D46) and `default` for the detail view's “Glance’s read” trigger (height 40). Build both now so issue 08 can use it.
5. **Judgment expansion.** Opening a ReasonPill shows the judgment's ✦ read and a SourcePanel in `judgment` ink. The full ReasonPanel belongs to issue 08.
6. **One panel per card.** In a SectionCard, at most one panel is open: a fact source or a judgment. Opening one closes the other.
7. **No outlines for state** (D43). Every hover and press is a color change; only `:focus-visible` draws an outline.

## Tokens to add
Add these to `src/design-system/tokens/tokens.css`. The two colors are aliases declared once in `:root`, like the Field aliases, so they follow the active theme.

| Token | Value | Use |
|---|---|---|
| `--color-row-hover` | `var(--color-surface-muted)` | Row hover fill |
| `--color-row-pressed` | `var(--color-surface-sunken)` | Row pressed fill |
| `--duration-enter` | `240ms` (`1ms` under reduced motion) | Rows and content that appear |

## What to build
- **`BriefRow`:** rank, name, optional AccountLabel and Badge, a request of up to two lines (✦ for summaries, “ ” for quotes), and up to 2 FactChips (urgent first). States: default, hover, pressed, focus-visible, selected (`aria-pressed`), leaving (collapses over `--duration-collapse`), new.
- **`SectionCard`:** title, count, and a right slot that accepts any content. Use text in the stories (“Most urgent first”, “From Gmail only”); ProgressBar comes in issue 13.
- **`ReasonPill`** (primitive): both sizes; see Decision 4 and the §3 spec.
- **`KnowRow`:** icon tile (from `icon` and `tone` in the data), bold title, text with one underlined fact value (`fact.value`) that opens its SourcePanel inline, optional AccountLabel, optional ReasonPill, and the “Moved by you” variant (no fact).
- **`CollapsedGroup`:** the Set aside card button, with the same row states as BriefRow; selected while the Set aside view is open.
- **`DoneRow`:** done, snoozed or moved to Set aside, each with its icon and Undo; enters with the enter motion.
- **`NewMailRow`:** “● 2 new since 8:00 AM · Add to brief”, with the dot in `--color-brand`.

## Acceptance criteria
- [ ] One `BriefRow` renders every item from all three personas without special cases.
- [ ] The request shows up to two lines on desktop and phone, then an ellipsis.
- [ ] Every Good to know fact opens its source; at most one panel (source or judgment) is open per SectionCard.
- [ ] ReasonPill has a hit area of at least 44 × 44 without changing its visible size or the row layout.
- [ ] Hover, pressed, selected, leaving and new are shown in stories, in both themes. No state uses an outline except focus-visible.
- [ ] With reduced motion, rows appear and collapse instantly.
- [ ] The three new tokens exist; no raw hex, px or ms values outside `tokens.css`.
- [ ] Matches `docs/screens/desktop-*.png` (left column) and `docs/screens/phone-brief.png`.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §2–4, `docs/design-rules.md` §3–5 and §11, `docs/screens/`

## Out of scope
Page layout (issue 06), the full ReasonPanel (issue 08), SetAsideList (issue 12), ProgressBar (issue 13).
