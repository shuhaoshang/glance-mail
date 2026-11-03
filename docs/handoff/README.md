# Design handoff

This folder is the work order for AI agents (Codex) and the checklist for the human reviewer.

## What design has delivered

| Deliverable | Where |
|---|---|
| Product brief v0.4 | `docs/product-brief.md` |
| User flows: three persona stories, step by step, with acceptance criteria | `docs/user-flows.md` |
| Design rules | `docs/design-rules.md` |
| Design system spec (components, scene cards, patterns) | `docs/design-system.md` |
| Tokens, light and dark | `src/design-system/tokens/tokens.css` |
| Mock data for three personas | `src/data/*.json` + `docs/data-model.md` |
| Decision log (D1–D40) | `docs/decisions.md` |
| Reference screens | `docs/screens/` (every flow step in `docs/screens/flows/`) |
| Clickable prototypes | `docs/prototype/` (open `index.html` in a browser) |
| Issues, in order | `docs/handoff/issues.md` and `issues/` |
| Prompt to start an agent | `docs/handoff/codex-kickoff.md` |

## Order of work

Issues 01 → 16, one PR each. 02–05 and 07 build the design system before any screen uses it (`AGENTS.md`: missing component → separate PR first).

```
01 scaffold ─┬─ 02 foundations ─ 03 primitives ─ 04 fact primitives ─┬─ 05 list composites ─ 06 brief page ─┬─ 08 detail ─┬─ 09 lifecycle
             │                                                       └─ 07 scene cards ──────────────────────┘             ├─ 10 ask
             │                                                                                     06 ─┬─ 11 demo bar      │
             │                                                                                         ├─ 12 set aside     │
             │                                                                                         ├─ 13 edge states   │
             │                                                                                         └─ 14 dark theme    ├─ 15 a11y pass
             │                                                                                                             └─ 16 e2e flows (also needs 12, 13)
```

## Creating the issues on GitHub

Either paste each file in `issues/` into **Issues → New issue** (title = first line, body = the rest), or, with the GitHub CLI logged in:

```sh
sh docs/handoff/create-issues.sh
```

## Reviewing a pull request (designer checklist)

1. **Does it match the screen?** Open the matching file in `docs/screens/` or the prototype side by side.
2. **Tokens only.** Search the diff for `#` colours and `px` values outside `tokens.css`.
3. **Right component?** Lists use `BriefRow`; details use the scene card named in the data; nothing new is built inside a feature PR.
4. **Content classes.** Quotes are verbatim; Glance’s words have ✦; urgent is a solid chip; one primary button.
5. **States.** Stories for default, hover, focus, selected, empty, dark theme, reduced motion.
6. **Accessibility.** Keyboard path works; focus is visible; labels read sensibly.
7. **Does the story still work?** Walk the matching steps in `docs/user-flows.md`; issue 16 automates this.
8. **Comment with the rule.** For example: “design-rules §4: scene cards hold only facts; move ‘Renewal risk’ to Glance’s read.”

## Done means

- The app is live on GitHub Pages for all three personas, desktop and phone, light and dark.
- Storybook documents every component in `docs/design-system.md`.
- Every issue is closed by a reviewed PR.
