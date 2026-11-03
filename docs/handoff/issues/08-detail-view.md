# 08 · Detail view: scene card, source, Glance’s read and original email

**Label:** `feat` · **Depends on:** 06, 07

## Why
Verify, then act: the detail is where a doubt gets resolved in one click.

## What to build
- Desktop `DetailPanel` and phone `DetailSheet` (top 56, radius 24, scrim, handle, close).
- Position (“Needs you · 1 of 3”), tabs (Details, Original email; add Ask in issue 10), title, Person, request with ✦ when it is a summary.
- Scene card; selecting a Field opens its `SourcePanel` below the card.
- `ReasonPanel` trigger and panel (“Why 1st”, judgments, nested evidence with judgment ink).
- Original email tab: `EmailView` with legend and highlighter switch.
- Action bar: “Open in {app}” as the primary (an external link; it can point to `#` in the demo). Done and Snooze arrive in issue 09; do not render them before they work.

## Acceptance criteria
- [ ] Every underlined value opens the right sentence with the right words highlighted.
- [ ] Only one primary button is visible.
- [ ] Matches `docs/screens/desktop-daniel.png` (decision card) and `docs/screens/phone-detail.png`.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-rules.md` §1, §5, `docs/prototype/`

## Out of scope
Ask, lifecycle actions.
