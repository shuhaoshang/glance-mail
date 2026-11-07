# Task 12 review: Set aside and new mail

This feature uses the Set aside components from PR #41, now on main.

## Screenshot matrix

Desktop captures use the supplied desktop-setaside reference size (1280 × 1295); phone captures use the user-flow size (390 × 844). Phone views scroll within the existing sheet. The added-mail phone capture scrolls to the appended Okto row; no item is selected automatically on phone.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya Set aside | [Light](desktop-open-light.jpg) | [Dark](desktop-open-dark.jpg) | [Light](phone-open-light.jpg) | [Dark](phone-open-dark.jpg) |
| Daniel Set aside | [Light](desktop-daniel-open-light.jpg) | [Dark](desktop-daniel-open-dark.jpg) | [Light](phone-daniel-open-light.jpg) | [Dark](phone-daniel-open-dark.jpg) |
| Sarah Set aside | [Light](desktop-sarah-open-light.jpg) | [Dark](desktop-sarah-open-dark.jpg) | [Light](phone-sarah-open-light.jpg) | [Dark](phone-sarah-open-dark.jpg) |
| Show in brief | [Light](desktop-kept-light.jpg) | [Dark](desktop-kept-dark.jpg) | [Light](phone-kept-light.jpg) | [Dark](phone-kept-dark.jpg) |
| Moved out of Needs you | [Light](desktop-moved-group-light.jpg) | [Dark](desktop-moved-group-dark.jpg) | [Light](phone-moved-group-light.jpg) | [Dark](phone-moved-group-dark.jpg) |
| New mail added | [Light](desktop-added-light.jpg) | [Dark](desktop-added-dark.jpg) | [Light](phone-added-light.jpg) | [Dark](phone-added-dark.jpg) |
| Maya steps 7–8 | [Light](desktop-added-kept-light.jpg) | [Dark](desktop-added-kept-dark.jpg) | [Light](phone-added-kept-light.jpg) | [Dark](phone-added-kept-dark.jpg) |
| Okto invoice | [Light](desktop-okto-light.jpg) | [Dark](desktop-okto-dark.jpg) | [Light](phone-okto-light.jpg) | [Dark](phone-okto-dark.jpg) |

Phone before adding: [Light](phone-before-add-light.jpg) · [Dark](phone-before-add-dark.jpg).

## Count checks

| Maya state | Coverage | Needs you | Good to know | Set aside | Progress |
| --- | --- | --- | --- | --- | --- |
| Initial | 38 | 3 | 3 | 31 | 1 of 4 |
| Keep SaaS Sales Weekly | 38 | 3 | 4 | 30 | 1 of 4 |
| Undo keeping | 38 | 3 | 3 | 31 | 1 of 4 |
| Move Halden to Set aside | 38 | 2 | 3 | 32 | 1 of 3 |
| Keep newsletter, then return Halden | 38 | 3 | 4 | 30 | 1 of 4 |
| Reply detected for Fernway | 38 | 2 | 3 | 31 | 2 of 4 |
| Add two new emails | 40 | 3 | 3 | 32 | 2 of 5 |
| Then keep SaaS Sales Weekly | 40 | 3 | 4 | 31 | 2 of 5 |

The added-mail screenshot without a simulated reply has four active items and 1 of 5 done; the steps 7–8 screenshot includes the reply and matches the flow's 2 of 5.

## Validation

- Rebased onto main after PRs #41 and #43 merged. Recaptured the 24 Set aside panel views in both themes to show the updated phone header and subject wrapping and the updated desktop Back to brief label.
- Read Issue #15 and its referenced design rules and screenshot, the full design system, product brief, data model, decision log, user flows, AGENTS.md, handoff README, and the relevant prototype markup and state logic.
- All three personas can open Set aside, keep a listed email, undo it, and return to the brief with consistent counts.
- Maya 7–8: new mail remains hidden until Add to brief; Okto appends after existing active items, the new newsletter appears in Set aside, and coverage grows from 38 to 40. Existing rows retain their order.
- Kept rows remain in Set aside with In Good to know and Undo. Their category count decreases; the number of undisplayed emails remains correct.
- Moved Needs you items appear first and return at their original rank via Back to Needs you or the existing Undo result.
- Coverage is checked against Needs you + Good to know + Set aside + done in the relevant flows. Existing lifecycle and Ask history regressions pass.
- The phone uses the existing DetailSheet. Close button, scrim, Escape, downward handle dragging, body scroll lock, and focus return to the summary were verified. On desktop, Back to brief returns to the brief.
- Reduced-motion flow tests pass; the existing motion tokens handle new and kept rows.
- Node 24 app/Storybook builds, TypeScript, ESLint, formatting, and American English checks.

## Open questions

None. The behavior follows the written specification and provided prototype.
