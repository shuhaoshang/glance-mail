# 21 · Restyle the shared pieces

**Label:** `ds` · **Depends on:** 20

## Why
A handful of existing components carry the new look: what is selected, how chips read, and how panels sit on the page.

## Decisions already made
1. Selected is ink for segments and white-with-ring for rows (D49). The brand-tint row fill is gone.
2. List chips are tinted by kind (D51).
3. The ReasonPill label changes to “Why it’s {ordinal}” (§9.5). The “Not for you?” block leaves the ReasonPanel now; Move to arrives in issue 27. Between the two, the only way to move a Needs you item is gone on purpose.
4. Ask leaves the action bar (D61); Snooze and Done become outline buttons.

## What to build
- **SegmentedControl:** selected segment `--color-ink` / `--color-on-ink`, no shadow. Add `size="small"` (§9.5).
- **FactChip:** tinted by kind; urgent unchanged (§9.4).
- **BriefRow:** selected state, radius, and a chevron on desktop too (§9.4).
- **DetailPanel:** `--shadow-panel`, padding 24 28 28, no border; action bar per §9.6 for Needs you and for checklist complete (without Move to for now).
- **ReasonPill / ReasonPanel:** ring, label rule, chevron; remove the “Not for you?” block; add the optional “Based on Watchlist” line as a prop (wired in issue 28).
- **SectionCard, CollapsedGroup, Notice, SnoozeMenu:** `--shadow-panel` where they sit on the page; no other change.
- Update the stories and interaction tests of each changed component, and the flow tests that name the old pill label or the Ask button.

## Acceptance criteria
- [ ] Stories show every state in §9.4 to §9.6 for the changed components, in both themes.
- [ ] A selected row has no purple fill anywhere, including hover and pressed.
- [ ] ReasonPill reads “Why it’s first: Renewal risk” for Maya's first item, “Why it’s second” for an item without a judgment, and “Why it’s ranked 11th” in a story with eleven items.
- [ ] The action bar has exactly one primary button in every state.
- [ ] Keyboard behavior and accessible names are unchanged except for the new pill label.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.4 to §9.6 · `docs/screens/v2/needs-you.png`, `needs-you-why.png`, `needs-you-source.png`

## Out of scope
Tabs, Move to, Heads-up and Other mail rows.
