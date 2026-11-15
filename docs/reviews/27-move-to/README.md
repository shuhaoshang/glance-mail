# Move to

Task 27 / [Issue #59](https://github.com/shuhaoshang/glance-mail/issues/59), based on main at `e9e122f` after PR #71.

Every email detail now offers the existing MoveMenu. Moves preserve the email's original content and account, append it to the destination list, update the counts and Needs you progress, and show a Toast with Undo. Returning an email to its original tab appends it there and removes the moved label.

## Screenshots

All 44 images use isolated Chromium contexts with emulated light/dark themes and reduced motion. Desktop is 1280 × 1000; phone is 390 × 844. Full-page captures include content below the viewport. The pointer pauses visible toasts on Undo while their state is captured. No system settings were changed.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya move menu | [Light](menu-desktop-light.jpg) | [Dark](menu-desktop-dark.jpg) | [Light](menu-phone-light.jpg) | [Dark](menu-phone-dark.jpg) |
| Daniel move menu | [Light](daniel-menu-desktop-light.jpg) | [Dark](daniel-menu-desktop-dark.jpg) | [Light](daniel-menu-phone-light.jpg) | [Dark](daniel-menu-phone-dark.jpg) |
| Sarah move menu | [Light](sarah-menu-desktop-light.jpg) | [Dark](sarah-menu-desktop-dark.jpg) | [Light](sarah-menu-phone-light.jpg) | [Dark](sarah-menu-phone-dark.jpg) |
| Needs you to Other mail | [Light](moved-to-other-mail-desktop-light.jpg) | [Dark](moved-to-other-mail-desktop-dark.jpg) | [Light](moved-to-other-mail-phone-light.jpg) | [Dark](moved-to-other-mail-phone-dark.jpg) |
| Moved Needs you detail in Heads-up | [Light](moved-detail-desktop-light.jpg) | [Dark](moved-detail-desktop-dark.jpg) | [Light](moved-detail-phone-light.jpg) | [Dark](moved-detail-phone-dark.jpg) |
| Newsletter moved to Heads-up | [Light](newsletter-desktop-light.jpg) | [Dark](newsletter-desktop-dark.jpg) | [Light](newsletter-phone-light.jpg) | [Dark](newsletter-phone-dark.jpg) |
| Daniel Personal email in Other mail | [Light](personal-moved-desktop-light.jpg) | [Dark](personal-moved-desktop-dark.jpg) | [Light](personal-moved-phone-light.jpg) | [Dark](personal-moved-phone-dark.jpg) |
| Undo returns to the original list | [Light](undo-desktop-light.jpg) | [Dark](undo-desktop-dark.jpg) | [Light](undo-phone-light.jpg) | [Dark](undo-phone-dark.jpg) |
| Return appends to the original tab | [Light](returned-to-original-desktop-light.jpg) | [Dark](returned-to-original-desktop-dark.jpg) | [Light](returned-to-original-phone-light.jpg) | [Dark](returned-to-original-phone-dark.jpg) |
| Last open Needs you item moved | [Light](last-needs-you-desktop-light.jpg) | [Dark](last-needs-you-desktop-dark.jpg) | [Light](last-needs-you-phone-light.jpg) | [Dark](last-needs-you-phone-dark.jpg) |
| Completed checklist move menu | [Light](checklist-complete-desktop-light.jpg) | [Dark](checklist-complete-desktop-dark.jpg) | [Light](checklist-complete-phone-light.jpg) | [Dark](checklist-complete-phone-dark.jpg) |

Before: [Maya desktop](../26-brief-in-tabs/maya-needs-you-desktop-light.jpg), [Maya phone detail](../26-brief-in-tabs/maya-needs-you-detail-phone-light.jpg). Compared with [desktop menu](../../screens/v2/needs-you-move.png), [moved detail and toast](../../screens/v2/heads-up-moved.png), and [phone menu](../../screens/v2/phone-sheet-move.png).

## How to review

1. Open Patterns/Move to → Menu, DanielMenu, or SarahMenu. The current tab is checked and unavailable. Arrow keys move between the two available destinations; Escape and outside clicks close the menu and restore focus.
2. Move an email to another tab. It leaves with the existing collapse animation, joins the end of its destination, and receives the destination's moved-row treatment. Source-list selection advances to the next remaining row, falling back to its first row when needed.
3. Open the moved detail. A Needs you email retains its scene, facts, source links, and account, with Open in {app} and Move to as its only action-bar controls outside Needs you. A Heads-up or Other mail email retains its original detail type.
4. Use Undo from either the list or an opened destination detail. The original tab, previous placement, counts, progress, and selection return. On the phone, the detail stays closed and focus returns to the restored row, as confirmed during this task.
5. Return an email manually to its original tab: it stays at the end and no longer says “Moved by you.” Compare ReturnedToOriginal with Undo.
6. LastNeedsYou shows AllDone while preserving the existing receipt rows. Undo restores the last moved item. Other mail's unlisted remainder stays unchanged even after all listed rows move out.

## Implementation and scope

- Reuses MoveMenu, ToastProvider, the moved rows/note, existing action controls, and collapse motion. No new UI component, token, or persona data was added.
- Session state tracks each tab's order and each email's original kind. Undo reverses the move without discarding separately added mail or unrelated item state. It also works while the moved email's own completion animation is pending.
- Progress includes only emails currently assigned to Needs you plus its existing receipts. Moving an email does not mark it done. Coverage stays constant until new mail is explicitly added.
- Facts, source and reasoning panels, Ask answers, checklist ticks, and the email highlighter remain available through the existing detail cache and session state.
- The toast uses the active phone dialog as its portal target when a destination detail is open, remaining accessible above the measured action bar. After a move, it appears on the list after the sheet closes.
- Recording moves in Memory remains out of scope. Watchlist attribution stays plain text until its navigation is connected. The supplied ranking and email copy are unchanged.

## Validation

- App and Storybook builds, lint, formatting, data validation, and English checks pass.
- All 128 Playwright checks pass across both themes and motion preferences. The previous Move to `fixme` cases are replaced by working flows; none are skipped.
- The move matrix verifies all six directed moves for each of the three email origins on desktop and phone, plus exact Undo, account links, returning to the original tab, source preservation, last-item behavior, new-mail interaction, incoming-item completion, and the unlisted Other mail remainder.
- 150 related Storybook stories have been verified in both themes at 1280 and 390: 600 distinct render/interaction cases. This includes the 11 new Move to stories and a focused recheck of SnoozedEmpty after a preview refresh.
- Phone and tablet menus were also checked at 390 and 768: they match the action bar's actual width.

## Open questions

**Demo reply simulation outside Needs you:** the completion flow operates on Needs you emails. If its target is moved to Heads-up or Other mail, the existing simulation button is disabled until that email returns; its label is unchanged. Proposal: retain this guard so the demo cannot mark an email done from a tab that has no Done action. Please confirm this behavior for the demo controls.
