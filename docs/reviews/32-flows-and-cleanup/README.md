# Visual 2.0 flow and screenshot review

[Issue #64](https://github.com/shuhaoshang/glance-mail/issues/64) closes the Visual 2.0 handoff. The review uses the built app at 1280, 1024, and 390 CSS pixels in both themes. Captures use browser-emulated reduced motion.

## Persona screenshots

| Persona | 1280 light | 1280 dark | 1024 light | 1024 dark | 390 light | 390 dark |
| --- | --- | --- | --- | --- | --- | --- |
| Maya | [Light](../../screens/desktop-maya.png) | [Dark](maya-desktop-dark.jpg) | [Light](maya-1024-light.jpg) | [Dark](maya-1024-dark.jpg) | [Light](maya-phone-light.jpg) | [Dark](maya-phone-dark.jpg) |
| Daniel | [Light](../../screens/desktop-daniel.png) | [Dark](daniel-desktop-dark.jpg) | [Light](daniel-1024-light.jpg) | [Dark](daniel-1024-dark.jpg) | [Light](daniel-phone-light.jpg) | [Dark](daniel-phone-dark.jpg) |
| Sarah | [Light](../../screens/desktop-sarah.png) | [Dark](sarah-desktop-dark.jpg) | [Light](sarah-1024-light.jpg) | [Dark](sarah-1024-dark.jpg) | [Light](../../screens/phone-brief.png) | [Dark](../../screens/phone-brief-dark.png) |

| Follow-up | Light | Dark |
| --- | --- | --- |
| Phone Demo after switching from Maya to Daniel | [Light](daniel-demo-phone-light.jpg) | [Dark](daniel-demo-phone-dark.jpg) |
| Daniel’s phone Settings with unbroken inbox dates | [Light](daniel-settings-phone-light.jpg) | [Dark](daniel-settings-phone-dark.jpg) |

Compare the [previous phone Settings](../31-settings-signed-out/daniel-phone-light.jpg) and the [previous brief captures](../26-brief-in-tabs/README.md). The refreshed [top-level captures](../../screens/) cover the corresponding built screens and edge-state stories. The Visual 2.0 reference images, design-system reference boards, and historical flow-step images are preserved.

## Flow coverage

| Acceptance steps | Automated coverage |
| --- | --- |
| All three journeys, including verification, original email, Ask, done and snoozed receipts, and Daniel and Sarah’s edge branches | [Maya](../../../e2e/maya.spec.ts), [Daniel](../../../e2e/daniel.spec.ts), [Sarah](../../../e2e/sarah.spec.ts) |
| First screen, tab counts and initial selection, each detail, four phone dismissal paths and returned focus | [Brief tabs](../../../e2e/brief-tabs.spec.ts) |
| Maya’s new mail, newsletter move and Undo, correction moves, current destination, preserved facts, completion and progress | [Maya](../../../e2e/maya.spec.ts), [Moves](../../../e2e/moves.spec.ts) |
| Watchlist counts, news links, add, empty validation, Escape, Cancel, remove and Undo | [Watchlist](../../../e2e/watchlist.spec.ts) |
| Memory counts, add and learned promotion to the end of Your instructions, remove and Undo | [Memory](../../../e2e/memory.spec.ts) |
| Theme persistence and System, Settings and Back to brief, sign-out and return, Demo disclosure, inbox dates | [Account menu](../../../e2e/account-menu.spec.ts), [Settings](../../../e2e/settings.spec.ts) |

## Comparison with the 37 Visual 2.0 references

The [reference files](../../screens/v2/) show the layout with design-tool sample content and some simplified states. The build uses the supplied persona data and the written specification. The Demo bar adds height above the header. The phone browser omits the drawn system status indicators. List and detail panels size to their own content, and rows use the documented text clamps, chips, focus treatments, and hit areas. These differences recur across the pairs below.

| Reference files | Remaining differences and reasons |
| --- | --- |
| `needs-you.png`, `dark-needs-you.png`, `phone-needs-you.png`, `phone-dark-needs-you.png` | Maya’s pending new-mail row is present. The actual receipts, progress, and quote lengths set the list height. The phone has no selected email until its sheet opens. The primary button and selected segments use the app’s tokens. D47, D54, D60 and §9.2–9.6 govern these details. |
| `daniel.png`, `phone-daniel.png`, `sarah.png`, `phone-sarah-sheet.png` | Daniel keeps the coverage note and two decision options with their text and timing facts. Sarah’s to-do scene shows the interactive checkboxes above the date fields. The closer spacing or omitted controls in the reference come from simplified scenes. D60 keeps the built scene cards. |
| `needs-you-source.png`, `needs-you-why.png` | The source has Open email and Close source. Reasoning includes its full judgments and a working Watchlist attribution. This adds content height. D60 and §9.5 govern the source actions and reasoning. |
| `needs-you-ask.png`, `needs-you-email.png`, `phone-sheet-email.png` | Ask retains its suggestions, answer thread, attribution and demo note. The Original email view retains the real paragraphs, legend, Highlighter switch and desktop guidance. The header and actions follow the active variant. D60 and D61 keep these views. |
| `heads-up.png`, `daniel-heads-up.png`, `phone-heads-up.png` | Maya has the source panel and linked Watchlist attribution. Daniel shows Personal only on Car service. The first phone row has no selection ring until opened. Other text and line breaks come from the supplied data and §9.3–9.5. |
| `other-mail.png`, `dark-other-mail.png`, `phone-sheet-other-mail.png` | The rows keep the supplied reason and time styles, and the details use the original paragraphs and highlight kinds actually present. The remaining count uses the full inbox total. Other mail detail has no view tabs, per §9.5. |
| `needs-you-move.png`, `phone-sheet-move.png`, `heads-up-moved.png` | The action stays in its pressed state while the menu is open. The menu uses the built tokens, current-location treatment, and positioning. Moved mail keeps its origin detail, includes its attribution, and uses the shared toast with Undo. D53 and §9.6–9.8 apply. |
| `needs-you-done.png` | The app retains the pending new-mail row, distinct completion and snooze icons, their receipt copy, and Undo. D54 keeps these inline. |
| `phone-sheet.png`, `phone-dark-sheet.png` | The real sheet uses the documented handle, scrim, underline tabs and pinned action bar. The built source and reasoning affordances retain their padding and hit targets. D44, D60 and §9.8 apply. |
| `watchlist.png`, `dark-watchlist.png`, `phone-watchlist.png`, `watchlist-add.png` | Panel and row padding, buttons, and form layout follow §9.9 and §9.11. Long names wrap within the available space. The Add action is disabled until there is input. On phones the two-line rows keep the hit targets and news pills. |
| `memory.png`, `dark-memory.png`, `phone-memory.png` | The app retains its form, list section spacing and row hit targets. Phone actions get their own right-aligned line. Calendar dates stay intact within the metadata. §9.10 governs the rows. |
| `account-menu.png`, `phone-account-menu.png` | The shared menu uses the written hit targets, placement, control tokens, and respective desktop and phone theme controls. The product starts with the saved theme or System. §9.12 applies. |
| `settings.png`, `dark-settings.png`, `signed-out.png` | Settings uses a text current-section state, outline Connect, text Delete, and the approved account labels and Quiet hours copy. The signed-out view keeps the Demo controls, a separate mark, and two outline sign-in buttons. These follow §9.13 and the PR #76 review. |

At 1024, there is no matching reference image. The desktop detail header, deal fields, and action group wrap using the previously approved rules in §9.5 and §9.6. The phone uses an independent sheet and hides the desktop utility tabs.

## Open questions

- The phone step in the user flows says any email detail has underline tabs. Section 9.5 specifies that Other mail has no view tabs. The tests follow §9.5. Update the phone step to name Needs you and Heads-up as the tabs whose details show underline navigation.
