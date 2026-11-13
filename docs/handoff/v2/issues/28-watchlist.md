# 28 · Watchlist

**Label:** `feat` · **Depends on:** 23, 26

## Why
Ranking by deadline and amount cannot know what someone is waiting on. Watchlist makes that visible and editable.

## Decisions already made
1. Changes last for the session and reset with the persona.
2. A new topic has no news and the status “Nothing yet”.
3. “N new” opens the one email named by `item`.

## What to build
- `WatchRow` in the design system with stories (§9.9), then the Watchlist panel in the app.
- The Watchlist tab in the TabBar's right group with its count and news dot; on the phone the header button and the “‹ Brief” page.
- Add, rename and remove with the toast and Undo.
- “Based on Watchlist: …” in the ReasonPanel and “Part of Watchlist: …” in Heads-up details now open the Watchlist tab. If the topic was removed, the line is not shown.

## Acceptance criteria
- [ ] Maya sees 8 topics, three with news; Daniel 5; Sarah 4.
- [ ] “2 new” on Fernway renewal opens Needs you with Fernway Logistics selected; “1 new” on Corvo Retail QBR opens Heads-up with that row selected; on the phone each opens the sheet.
- [ ] The dot disappears when no remaining topic has news.
- [ ] Long names wrap without overlapping the buttons at 390 wide.
- [ ] Add and Save are disabled while the input is empty or only spaces; focus returns to a sensible place after add, save, cancel and remove.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.9 · `docs/screens/v2/watchlist.png`, `watchlist-add.png`, `phone-watchlist.png`, `dark-watchlist.png`

## Out of scope
Changing ranking when a topic is added.
