# 20 · Tokens 2.0 and the page background

**Label:** `ds` · **Depends on:** 19

## Why
Depth, ink and amber dates all come from tokens. Replacing the token file first restyles most of the app before any component changes.

## Decisions already made
1. `docs/handoff/v2/provided/tokens.css` is the new `src/design-system/tokens/tokens.css`. Copy it byte for byte.
2. Radius values change on existing tokens (`--radius-card` 28, `--radius-panel` 20, `--radius-sheet` 28), so existing components pick them up without edits.
3. Time colors are amber. No component may use a time token to mean urgent or danger; they do not today.

## What to build
- Replace `tokens.css` with the provided file.
- Page background: `body` uses `background: var(--background-page)` with `background-repeat: no-repeat` and `min-height: 100vh`, in the app and in Storybook's preview so stories sit on the same page.
- Greeting: the desktop greeting uses `--font-size-40`/`--line-height-40` at medium weight; the phone greeting 28/32 at medium. Add the `Text` variant if one is needed.
- List and detail columns use the new `--gap-column` (no code change expected; verify).
- Foundations stories: add the new tokens to the Colors, Radius and Type pages with the groups “Page and surfaces”, “Ink”, and the shadow tokens; update any hard-coded descriptions (time is amber).
- Fix anything the new values break visually (for example a nested radius that now looks wrong). List each fix in the PR.

## Acceptance criteria
- [ ] The app renders with the tinted page and glows, white panels with 28 radius, and amber dates, in light and dark.
- [ ] The only red on screen is the urgent chip and the scene card's urgent marks.
- [ ] No component CSS contains a raw value introduced by this PR.
- [ ] Storybook foundations list every token in the file (the pages read the file, so the count matches).
- [ ] Text contrast: muted text on the page is at least 4.5:1 in both themes (it is 5:1 by design; verify with a check in the PR).
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.1 · `docs/screens/v2/needs-you.png`, `dark-needs-you.png` (for page and panel look only; the layout changes later)

## Out of scope
Tabs, new components, any layout change. The selected row and segmented control keep their current look until issue 21.
