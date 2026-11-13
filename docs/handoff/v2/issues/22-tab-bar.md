# 22 · TabBar

**Label:** `ds` · **Depends on:** 20

## Why
The tabs are the new top-level navigation. Building the component alone first lets its states and keyboard behavior be reviewed in Storybook.

## Decisions already made
1. Two groups on desktop, one on the phone. A tab is a name and a count; a dot means new (D47).
2. The component renders only the tabs it is given, so the app can add Watchlist and Memory when they exist.

## What to build
- `TabBar` with props for the left and right groups: each tab has `id`, `label`, `count`, optional `hasNews`; plus `selected` and `onSelect`.
- Glass groups, tab states, the news dot, roles and arrow keys exactly as §9.3.
- Phone layout: one group, full width, equal tabs.
- The phone header buttons for Watchlist and Memory (§9.2) as a small `HeaderButton` (40 round, glass, selected is ink, optional news dot). An `IconButton` variant is fine if it keeps the 44 hit area.

## Acceptance criteria
- [ ] Stories: five tabs with Needs you selected; each other tab selected; the news dot on a selected and an unselected tab; left group only; phone; dark.
- [ ] Arrow keys move between tabs of a group and select; Tab moves to the next group; each group has an accessible name.
- [ ] The selected tab does not change on hover. Unselected tabs use `--color-glass-hover`.
- [ ] At 390 wide the three labels fit on one line with their counts.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.2, §9.3 · `docs/screens/v2/needs-you.png`, `phone-needs-you.png`, `dark-needs-you.png`

## Out of scope
Using the tabs in the app.
