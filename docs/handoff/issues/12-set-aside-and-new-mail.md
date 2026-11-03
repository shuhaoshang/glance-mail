# 12 · Set aside view, Show in brief and new mail

**Label:** `feat` · **Depends on:** 06

## Why
Nothing disappears silently: set-aside mail is one click away, and the user can teach Glance.

## What to build
- Set aside view in the detail area (desktop) or as a full screen (phone): groups, counts, rows, “+N more” as plain text, back to brief.
- “Show in brief” moves an email to Good to know (“Moved by you”), lowers the counts, and can be undone.
- Items the user moved out of Needs you (issue 09) come first, in a group “Moved by you”, each with its request and a “Back to Needs you” text button. “+N more” appears only when there are more rows than shown.
- Maya’s `newMail`: the “2 new since 8:00 AM · Add to brief” row; adding it reveals Okto Freight (marked New) at the end of Needs you, adds the newsletter to Set aside, and grows the coverage count.

## Acceptance criteria
- [ ] All counts (coverage, set aside summary, Good to know) stay consistent, including after Move to Set aside and Back to Needs you.
- [ ] The brief never reorders on its own.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-rules.md` §7–8, `docs/screens/desktop-setaside.png`
