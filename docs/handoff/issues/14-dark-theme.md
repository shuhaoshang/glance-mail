# 14 · Dark theme in the app

**Label:** `feat` · **Depends on:** 06, 11

## Why
Tokens already have dark values; the app should follow the system setting and let viewers switch.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §6 (Demo bar).

1. The theme switch in the demo bar has three options: **System · Light · Dark**. The default is System, which follows `prefers-color-scheme`.
2. The viewer's choice is remembered in their browser (`localStorage`, wrapped in try/catch; the app works the same if storage is unavailable).

## What to build
- Follow `prefers-color-scheme` by default; a theme switch in the demo bar sets `data-theme`.
- Check every screen and Storybook story in dark theme; fix any component that used a raw color.

## Acceptance criteria
- [ ] No component sets a color that is not a token.
- [ ] System follows the operating system live; Light and Dark override it and survive a reload.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] Dark screens match `docs/screens/phone-brief-dark.png` in spirit (same tokens).
- [ ] Contrast stays AA (spot-check the muted text and urgent chips).
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`src/design-system/tokens/tokens.css`, `docs/decisions.md` D32
