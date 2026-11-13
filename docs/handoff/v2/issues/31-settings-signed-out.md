# 31 · Settings and the signed-out page

**Label:** `feat` · **Depends on:** 30

## Why
Inboxes, quiet hours and the account need a home, and Log out needs somewhere to lead.

## Decisions already made
1. Controls keep their state for the session. Only Appearance changes anything else.
2. Disconnect, Connect and Delete confirm with “This is a demo. Nothing was changed.” so that nothing is a dead control.
3. These are views inside the single-page app, not routes.

## What to build
- The Settings page and the signed-out page per §9.13, built from existing components (Switch, SegmentedControl, Button, Person).
- Add “Inboxes”, “Settings” and “Log out” to the account menu.
- A native `select` styled as the outline button for the three time values.

## Acceptance criteria
- [ ] Inboxes lists the persona's accounts (Daniel and Sarah: two rows each) with the right app names.
- [ ] Quiet hours is on for Daniel and off for Maya and Sarah.
- [ ] “Back to brief” returns to the tab the person left, with its selection.
- [ ] Both sign-in buttons return to the brief. The demo bar stays visible on both pages.
- [ ] The section list links move focus to the section heading.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.13 · `docs/screens/v2/settings.png`, `dark-settings.png`, `signed-out.png`

## Out of scope
Real accounts, real notifications.
