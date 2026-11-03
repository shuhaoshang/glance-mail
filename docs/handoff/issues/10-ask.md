# 10 · Ask tab: answers only from email, with sources

**Label:** `feat` · **Depends on:** 08

## Why
The third pass (asking the AI again) should also be verifiable, or say plainly that the email doesn’t say.

## What to build
- Ask tab and “Ask” tint button in the action bar.
- Suggested questions from `item.qa`; choosing one adds the question bubble and its answer.
- Found answers show ✦ Glance, the answer and a nested source; not-found answers show “Not in your email” in a dashed box.
- **No free-text input in the demo** (decision D39). Answers are prepared in advance, so a dashed note sits where the input would be: “**Demo:** answers are prepared in advance, so pick a question above. In the product you type your own.” When every question has been asked: “**Demo:** that’s every prepared question for this item.”

## Acceptance criteria
- [ ] Every question in the data can be asked and answered.
- [ ] Not-found answers never show a ✦ or a source.
- [ ] Nothing in the Ask tab looks typeable or sendable.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §4 AskThread

## Out of scope
Real AI calls.
