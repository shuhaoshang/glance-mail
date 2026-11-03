# 11 · Demo bar: persona switch and the 1 · 2 · 3 level switch

**Label:** `feat` · **Depends on:** 06

## Why
Viewers should be able to compare the three personas and the three levels of AI output in seconds.

## What to build
- A dark demo bar above the app, styled as demo chrome, labelled “Demo controls · Not part of the product”.
- Persona switch (Maya · Sales, Daniel · Manager, Sarah · Parent) updating the URL.
- Level switch: 1 Plain AI text (`demo.levels.l1`), 2 Formatted (`demo.levels.l2`), 3 Glance (the real brief).
- On phone the bar collapses into a single “Demo” button that opens the same controls.

## Acceptance criteria
- [ ] Switching level keeps the selected persona; switching persona keeps the level.
- [ ] Levels 1 and 2 use only text styles, no components.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/product-brief.md` §18, `docs/screens/desktop-levels.png`
