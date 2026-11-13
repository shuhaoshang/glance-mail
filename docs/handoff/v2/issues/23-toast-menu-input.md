# 23 · Toast, MoveMenu and TextInput

**Label:** `ds` · **Depends on:** 20

## Why
Move to, Watchlist and Memory all need the same three pieces: a menu, a confirmation with Undo, and a text field.

## Decisions already made
1. The toast is only for moves and for Watchlist and Memory edits. Done and Snooze keep their rows (D54).
2. One toast at a time, 6 seconds, paused on hover and focus.

## What to build
- `MoveMenu` (§9.7): three destinations, the current one checked and disabled, the foot note; menu roles and focus rules.
- `Toast` and a small provider or hook so any screen can show one (§9.7): message with a bold first sentence, optional Undo, close button, timing, `role="status"`.
- `TextInput` (§9.11) and an `InlineForm` composite: input, primary button (disabled while empty), Cancel, and an optional ✦ note; Enter submits, Escape cancels.
- New icons if missing: move, eye, bulb, pencil, trash, plus, chevron-down, quote mark. Same stroke style as the existing set.

## Acceptance criteria
- [ ] Stories for every state in §9.7 and §9.11, in both themes, on desktop and phone.
- [ ] MoveMenu: focus lands on the first enabled item; Escape and an outside click close it and return focus to the trigger; the current tab cannot be activated by mouse or keyboard.
- [ ] Toast: a second toast replaces the first; the timer pauses while the pointer or focus is inside; Undo calls back once and closes it.
- [ ] On the phone the toast spans the width with 16 margins and does not cover the sheet's action bar when a sheet is open (it sits above it).
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.7, §9.11 · `docs/screens/v2/needs-you-move.png`, `heads-up-moved.png`, `watchlist-add.png`, `phone-sheet-move.png`

## Out of scope
Moving emails, Watchlist and Memory screens.
