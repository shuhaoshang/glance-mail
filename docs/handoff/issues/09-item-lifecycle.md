# 09 · Item lifecycle: Done, Snooze, Undo, all done and simulated reply

**Label:** `feat` · **Depends on:** 08, 11

## Why
Glance keeps score: items leave the list when handled, and nothing disappears without a way back.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §4 and `docs/decisions.md`.

1. **After an action on phone** (D44): Done, Mark done, a Snooze option or Move to Set aside closes the sheet and returns to the brief, where the DoneRow shows the result. The next item becomes selected, but the sheet does not reopen. On desktop the panel shows the next item.
2. **SnoozeMenu** opens directly above the action bar, with its three options as `outline` Buttons (issue 18). Choosing an option, Escape, or Snooze again closes it.
3. **“Move to Set aside”** is an `outline` Button with the tray-arrow icon.
4. **“Simulate reply to {sender}”** goes in the demo bar from issue 11.
5. DoneRows enter with the enter motion from issue 05.

## What to build
- Done (manual): the row collapses (320 ms), the next item is selected, a `DoneRow` appears with Undo.
- Snooze menu (3 options); snoozed rows show a clock and Undo.
- Progress updates; when nothing is left show “Nothing else needs you today” with Good to know and Set aside counts.
- Demo bar button “Simulate reply to {sender}” (from `demo.simulate`): marks that item done as “reply detected in {app}, {time}”. If already done, the button says so.
- **Move to Set aside** (decision D37): at the end of Glance’s reasoning, “Not for you? Glance will rank emails like this lower.” and a neutral “Move to Set aside” button. The item collapses like Done, the next item is selected, a `DoneRow` reads “**Name** · moved to Set aside by you” with Undo, the action count drops by one (never counted as done), and Set aside grows by one. Issue 12 shows it in Set aside.
- **Checklist complete** (decision D34): when every step of a checklist is ticked, “Mark done” becomes the primary, “Open in {app}” turns neutral, Snooze is hidden, and `scene.doneNote` appears under the card. Unticking a step restores the default bar. Ticks never mark the item done on their own.

## Acceptance criteria
- [ ] Undo restores the item in its original rank.
- [ ] With every checklist step ticked there is still exactly one primary button, and it is “Mark done”.
- [ ] Moving Halden Health to Set aside: Needs you 2, progress “1 of 3 done”, Set aside 32; Undo restores Needs you 3, “1 of 4 done”, Set aside 31.
- [ ] Progress and counts stay correct after any sequence of done, snooze and undo.
- [ ] Reduced motion: rows disappear without animation.
- [ ] On phone, every action closes the sheet and the brief shows the DoneRow and the new progress.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-rules.md` §8, `docs/product-brief.md` §9, `docs/user-flows.md` (Maya 6, Daniel 5–6, Sarah 4–5), `docs/screens/phone-detail-checked.png`, `docs/screens/phone-done.png`

## Out of scope
Carried-over items and a time simulator.
