# 27 · Move to

**Label:** `feat` · **Depends on:** 23, 26

## Why
People must be able to correct Glance's sorting in one way that works the same for every email.

## Decisions already made
1. One control, three destinations, Undo in a toast (D53).
2. Moved emails join the end of the destination list (nothing reshuffles).
3. Moving an email back to its original tab removes “Moved by you” and puts it at the end of that list, not in its old place. Undo in the toast is what restores the exact previous state.

## What to build
- The Move to button and MoveMenu in every email detail and in the sheet (§9.6, §9.7).
- State for moves across the three tabs, with counts, progress (“1 of 4 done” counts only emails currently in Needs you), selection of the next row, and the sheet closing on the phone.
- The toast with Undo for every move.
- Moved rows and the moved note from issue 25, now with live data.
- Remove the `fixme` marks on the Move to flow steps and make them pass.

## Acceptance criteria
- [ ] Every one of the six moves works for a Needs you item, a Heads-up item and an Other mail row, on desktop and phone.
- [ ] Undo restores lists, order, counts, progress and selection exactly.
- [ ] A moved Needs you item in Other mail still opens its facts, sources and scene card, and offers Open in {app} and Move to only.
- [ ] Moving the last open Needs you item shows AllDone; undoing brings the list back.
- [ ] The Other mail count is `total` plus moved-in minus moved-out; “N more like these” does not change when a listed row moves.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.4 to §9.7 · `docs/user-flows.md` “Visual 2.0” · `docs/screens/v2/needs-you-move.png`, `heads-up-moved.png`, `phone-sheet-move.png`

## Out of scope
Recording moves in Memory (later round).
