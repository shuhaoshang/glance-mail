# 11 · Demo bar: persona switch and the 1 · 2 · 3 level switch

**Label:** `feat` · **Depends on:** 06

## Why
Viewers should be able to compare the three personas and the three levels of AI output in seconds.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §6 (Demo bar).

1. The bar is dark in both themes and uses only `--color-demo-*` tokens, so it never looks like the product. Controls hover with the new `--color-demo-control-hover`; keyboard focus uses the usual brand outline.
2. On phone, the “Demo” button opens the controls in a panel that drops down under the bar. It does not use the product's sheet.
3. Leave room in the bar for controls that later issues add: “Simulate reply to {sender}” (issue 09) and the theme switch (issue 14).

## Tokens to add

| Token | Value |
|---|---|
| `--color-demo-control-hover` | `#36343F` (same in both themes) |

## What to build
- A dark demo bar above the app, styled as demo chrome, labeled “Demo controls · Not part of the product”.
- Persona switch (Maya · Sales, Daniel · Manager, Sarah · Parent) updating the URL.
- Level switch: 1 Plain AI text (`demo.levels.l1`), 2 Formatted (`demo.levels.l2`), 3 Glance (the real brief).
- On phone the bar collapses into a single “Demo” button that opens the same controls.

## Acceptance criteria
- [ ] Switching level keeps the selected persona; switching persona keeps the level.
- [ ] Levels 1 and 2 use only text styles, no components.
- [ ] The bar looks the same in light and dark themes.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/product-brief.md` §18, `docs/design-system.md` §6, `docs/screens/desktop-levels.png`
