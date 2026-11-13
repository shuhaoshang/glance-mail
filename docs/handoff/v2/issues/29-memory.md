# 29 · Memory

**Label:** `feat` · **Depends on:** 28

## Why
Glance sorts email by rules. The person has to be able to read and change them.

## Decisions already made
1. Editing a learned pattern turns it into an instruction (D56).
2. Changes last for the session.

## What to build
- `MemoryRow` in the design system with stories (§9.10), then the Memory panel in the app.
- The Memory tab with its count; the phone header button and page.
- Add an instruction, edit and remove either kind, with the toasts in §9.7 and Undo.

## Acceptance criteria
- [ ] Maya: “Your instructions 2”, “Learned 3”. After editing one learned pattern: 3 and 2, the edited one last under instructions with “Was learned · edited just now”.
- [ ] Undo after remove puts the row back in its place.
- [ ] On the phone, Edit and Remove sit under the text, aligned right, and each has a 44 target.
- [ ] Section counts and the tab count stay in sync.
- [ ] Light and dark, desktop (1280) and phone (390), with screenshots in the PR.
- [ ] Anything the documents do not define is under **Open questions** with a proposal, not invented.
- [ ] CI is green; the PR description follows `AGENTS.md`.

## References
`docs/design-system.md` §9.10 · `docs/screens/v2/memory.png`, `phone-memory.png`, `dark-memory.png`

## Out of scope
Applying instructions to the email lists.
