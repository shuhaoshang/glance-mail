# Task 12 component review

This is the design-system prerequisite required by AGENTS.md before the task 12 feature PR.

SetAsideList renders supplied category counts, rows, kept states, and the Moved by you group. The caller owns state and navigation. The component uses existing tokens, shared buttons, badges, and the provided mail content.

| State | Light | Dark |
| --- | --- | --- |
| Default | [Light](default-light.jpg) | [Dark](default-dark.jpg) |
| Kept row | [Light](kept-light.jpg) | [Dark](kept-dark.jpg) |
| Moved by you | [Light](moved-by-you-light.jpg) | [Dark](moved-by-you-dark.jpg) |
| Phone content | [Light](phone-light.jpg) | [Dark](phone-dark.jpg) |

Desktop content is constrained to the same detail-column width as the supplied reference. The phone story shows the content component; the feature mounts it in the existing modal sheet.

Supporting component states include whole-email KnowRows labeled Moved by you, NewMailRow's noninteractive added acknowledgement, the optional AllDone review action, and the CollapsedGroup trigger callback used for focus return.

Keyboard callbacks, exact moved-row counts without an unnecessary +N more row, TypeScript, ESLint, formatting, app/Storybook builds, and English checks are verified. No new tokens, dependencies, or mock-data edits.
