# 08 · Detail view: scene card, source, Glance’s read and original email

**Label:** `feat` · **Depends on:** 06, 07, 18

## Why
Verify, then act: the detail is where a doubt gets resolved in one click.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §2–4 and `docs/decisions.md`.

1. **Phone sheet** (D44): slides up over `--duration-collapse` while the scrim fades in over `--duration-reveal`, and closes in reverse; instant with reduced motion. It closes with the close button, a tap on the scrim, Escape, or a drag on the handle. It is a modal dialog: focus moves in, stays in, and returns to the row that opened it.
2. **Desktop panel** is part of the page, not a dialog.
3. **“Open in {app}”** (D45) opens the app's web inbox in a new tab (`https://mail.google.com/`, `https://outlook.office.com/mail/`, `https://mail.yahoo.com/`). Never `#`.
4. The **“Glance’s read” trigger** is the `default` ReasonPill from issue 05. The **highlighter** is the Switch from issue 18.
5. This replaces the plain-text placeholder that issue 06 put in the detail area.

## Tokens to add

| Token | Value |
|---|---|
| `--size-sheet-top` | `56px` |
| `--size-handle-width` | `36px` |
| `--size-handle-height` | `4px` |

## What to build
- Desktop `DetailPanel` and phone `DetailSheet` (top 56, radius 24, scrim, handle, close).
- Position (“Needs you · 1 of 3”), tabs (Details, Original email; add Ask in issue 10), title, Person, request with ✦ when it is a summary.
- Scene card; selecting a Field opens its `SourcePanel` below the card.
- `ReasonPanel` trigger and panel (“Why 1st”, judgments, nested evidence with judgment ink).
- Original email tab: `EmailView` with legend and highlighter switch.
- Action bar: “Open in {app}” as the primary (an external link to the web inbox, see Decision 3). Done and Snooze arrive in issue 09; do not render them before they work.

## Acceptance criteria
- [ ] Every underlined value opens the right sentence with the right words highlighted.
- [ ] Only one primary button is visible.
- [ ] The phone sheet closes by button, scrim, Escape and handle drag; focus returns to the row.
- [ ] No link points to `#`.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] Matches `docs/screens/desktop-daniel.png` (decision card) and `docs/screens/phone-detail.png`.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-rules.md` §1, §5, `docs/design-system.md` §4 (DetailPanel, EmailView), `docs/decisions.md` D44–D45, `docs/prototype/`

## Out of scope
Ask, lifecycle actions.
