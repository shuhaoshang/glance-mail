# 26 · The brief in tabs

**Label:** `feat` · **Depends on:** 22, 25

## Why
This is the structural change: the one-page brief becomes three email tabs, each a list and a detail.

## Decisions already made
1. Watchlist and Memory tabs are not rendered yet; the TabBar gets the left group only (no dead tabs, D29).
2. The old Set aside view and its collapsed row leave the app in this PR. Until issue 27 there is no way to move an email between tabs; that is accepted.
3. Each tab remembers its selected row for the session. Desktop selects the first row when a tab is first opened; the phone selects nothing.
4. Everything in the README's “built app wins” list keeps working inside the Needs you tab: new mail, Done, Snooze, Simulate reply, checklist, Ask, levels.

## What to build
- Page structure per §9.2 on desktop and phone.
- Needs you tab: panel head, BriefRows, NewMailRow first, DoneRows last, AllDone when empty; detail panel as today.
- Heads-up tab and Other mail tab with their rows and details. Counts per §9.3. New mail adds “Revenue Ops Digest” to the end of Other mail (count 32) and Okto Freight to Needs you.
- Phone: tabs, list panel, and the sheet for all three tabs.
- Position text in the detail (“Heads-up · 2 of 3”, “Other mail · 1 of 31”).
- Leave the demo bar unchanged in this PR (its theme control moves in issue 30).
- Update the Playwright flows to the “Visual 2.0” section of `docs/user-flows.md` for the steps that this PR changes (brief opens, new mail, opening Other mail and Heads-up). Mark the Move to steps as `fixme` with a link to issue 27.

## Acceptance criteria
- [ ] Maya opens to Needs you 3 · Heads-up 3 · Other mail 31; Daniel 4 · 3 · 64; Sarah 3 · 2 · 18.
- [ ] Switching tabs keeps each tab's selection and does not reset Ask history, ticks or open panels of the item.
- [ ] “Open in {app}” names the app of the email's account for every item in every tab (Daniel: Gmail; Sarah's Lincoln Elementary: Yahoo Mail).
- [ ] Arrow keys in the tab bar switch tabs; focus order is header, tabs, list, detail.
- [ ] The page has one `h1` (the greeting); each panel has an accessible name.
- [ ] No horizontal scroll at 390 or at 1024 to 1280.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.2 to §9.6, §9.8 · `docs/user-flows.md` “Visual 2.0” · `docs/screens/v2/needs-you.png`, `needs-you-done.png`, `heads-up.png`, `other-mail.png`, `daniel.png`, `sarah.png`, `phone-needs-you.png`, `phone-heads-up.png`

## Out of scope
Move to, Watchlist, Memory, account menu, edge states.
