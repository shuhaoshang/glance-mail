# 25 · Rows and details for Heads-up and Other mail

**Label:** `ds` · **Depends on:** 21, 24

## Why
Heads-up becomes selectable and Other mail becomes a real list with the original email. These are the components the tabbed brief is assembled from.

## Decisions already made
1. A Heads-up row no longer underlines a value; its detail always shows the source (D52).
2. Other mail shows the email itself with highlights, not a summary (D52).
3. A moved email uses the destination tab's row and keeps its own detail (§9.4, §9.5).

## What to build
- `HeadsUpRow` (replaces KnowRow in the app; keep KnowRow only if an edge-state story needs it).
- `OtherMailRow`, and the “N more like these” line as part of the list component.
- Moved-row rendering for all three row types, from the table in §9.4.
- `DetailPanel` variants: Heads-up detail (Details and Original email) and Other mail detail (reason line, basis tag, email block, legend), plus the “You moved this here” note. Reuse SourcePanel, EmailView highlighting, GlanceMark, Person and AccountLabel.
- The list panel head for Needs you (“By deadline, then amount”, progress) and the empty-tab state (§9.4, §9.5).
- The same details inside `DetailSheet` with underline tabs (§9.8). The sheet's behavior does not change.

## Acceptance criteria
- [ ] Stories use the real persona data: Maya's three Heads-up items and four Other mail rows; Daniel's “Car service” with the Personal label; one moved row of each kind in each tab.
- [ ] The legend lists only the highlight kinds present in the email.
- [ ] Heads-up detail for Brightline shows a ReasonPill “Why it’s here: Upsell signal” that opens the read and its source.
- [ ] “N more like these” is plain text and is absent when N is 0.
- [ ] Underline tabs in the sheet have the same roles and arrow-key behavior as SegmentedControl.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.4, §9.5, §9.8 · `docs/screens/v2/heads-up.png`, `other-mail.png`, `daniel-heads-up.png`, `phone-sheet.png`, `phone-sheet-other-mail.png`, `dark-other-mail.png`

## Out of scope
Wiring into the app, Move to.
