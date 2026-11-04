# 02 · Foundations in Storybook: tokens, themes and text styles

**Label:** `ds` · **Depends on:** 01

## Why
The design system starts with its foundations, documented so reviewers can check values at a glance.

## What to build
- Storybook pages: Colors (every `--color-*` token, light and dark side by side), Type, Spacing, Radius, Motion.
- A global toolbar toggle for theme (light / dark) that sets `data-theme` on the root.
- Text style components or classes: Display, Request, Title, Section, Body, Reading, Meta, Chip, with phone and desktop sizes from `docs/design-system.md` §3.
- Icon set from §3 as React components (stroke 2, round caps).

## Acceptance criteria
- [ ] Every token in `tokens.css` appears in Storybook, read from the CSS (not retyped).
- [ ] Switching the theme changes every swatch and text style.
- [ ] No raw hex or px values outside `tokens.css`.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §2–3, `docs/screens/ds-foundations.png`

## Out of scope
Components other than text styles and icons.
