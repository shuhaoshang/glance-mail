# 10 · Ask tab: answers only from email, with sources

**Label:** `feat` · **Depends on:** 08, 18

## Why
The third pass (asking the AI again) should also be verifiable, or say plainly that the email doesn’t say.

## Decisions already made
The designer approved these before the work started. They are written into `docs/design-system.md` §4 (AskThread).

1. Suggested questions are `outline` Buttons (issue 18).
2. The “Not in your email” box has a `--border-hairline` dashed `--color-border-strong` outline. The demo note uses the same dashed outline.
3. Each new question and answer appears with the enter motion from issue 05.

## What to build
- Ask tab and “Ask” tint button in the action bar.
- Suggested questions from `item.qa`; choosing one adds the question bubble and its answer.
- Found answers show ✦ Glance, the answer and a nested source; not-found answers show “Not in your email” in a dashed box.
- **No free-text input in the demo** (decision D39). Answers are prepared in advance, so a dashed note sits where the input would be: “**Demo:** answers are prepared in advance, so pick a question above. In the product you type your own.” When every question has been asked: “**Demo:** that’s every prepared question for this item.”

## Acceptance criteria
- [ ] Every question in the data can be asked and answered.
- [ ] Not-found answers never show a ✦ or a source.
- [ ] Nothing in the Ask tab looks typeable or sendable.
- [ ] Anything the docs do not define is raised under **Open questions** with a proposal, not invented.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §4 AskThread

## Out of scope
Real AI calls.
