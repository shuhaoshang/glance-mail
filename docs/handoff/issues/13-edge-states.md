# 13 · Edge-state patterns: first brief, new mail, disconnected inbox, overload, quiet hours

**Label:** `ds` · **Depends on:** 06

## Why
A trustworthy brief must say when it is incomplete, and stay on one screen on a heavy day.

## What to build
- Storybook `Patterns/Edge states` stories that match `docs/screens/phone-first-brief.png`, `phone-new-mail.png`, `phone-disconnected.png` and `phone-overload.png`.
- `Notice`, `Skeleton` and `ProgressBar` components as needed.
- Disconnected: say what is missing in the coverage line, a Notice with Reconnect (the one primary) and the section header (“From Gmail only”). Build it from Sarah's data with the Yahoo items removed.
- Overload: Needs you shows the top 4 on phone, then “Show 8 more, ranked the same way”.
- Quiet hours (decision D35), matching `docs/screens/phone-quiet-hours.png`: “Good evening, Daniel”, “Personal inbox only.”, a moon label “Quiet hours until 8:00 AM”, a calm card “Nothing personal needs you tonight” / “12 work emails arrived after 7:00 PM. They’ll be in tomorrow’s brief at 8:00 AM.” with the text button “Show work email anyway” (fires an `onShowWork` action), then Good to know (Car service) and “3 set aside”. Build it from Daniel’s data with the Work items removed.

## Acceptance criteria
- [ ] A partial brief never looks complete in any story.
- [ ] The overload pattern never exceeds one phone screen for Needs you.
- [ ] The quiet-hours story shows no work item anywhere.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-rules.md` §8 (States the brief must handle), `docs/product-brief.md` §14, `docs/user-flows.md` (Daniel 8, Sarah 6–7)

## Out of scope
Real sync or OAuth.
