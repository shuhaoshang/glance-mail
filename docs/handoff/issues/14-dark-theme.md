# 14 · Dark theme in the app

**Label:** `feat` · **Depends on:** 06

## Why
Tokens already have dark values; the app should follow the system setting and let viewers switch.

## What to build
- Follow `prefers-color-scheme` by default; a theme switch in the demo bar sets `data-theme`.
- Check every screen and Storybook story in dark theme; fix any component that used a raw color.

## Acceptance criteria
- [ ] No component sets a color that is not a token.
- [ ] Dark screens match `docs/screens/phone-brief-dark.png` in spirit (same tokens).
- [ ] Contrast stays AA (spot-check the muted text and urgent chips).
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`src/design-system/tokens/tokens.css`, `docs/decisions.md` D32
