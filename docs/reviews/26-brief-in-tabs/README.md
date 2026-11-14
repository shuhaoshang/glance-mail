# The brief in tabs

Task 26 / [Issue #58](https://github.com/shuhaoshang/glance-mail/issues/58), based on main at `e9e1b01` after PR #70.

The app now uses Needs you, Heads-up, and Other mail. Each tab keeps its selected row, and each item's mounted detail keeps its sources, reasoning, view, and highlighter setting. Ask history and checklist progress remain in the persona session. Desktop opens the first row; phone opens no sheet until a row is selected.

## Screenshots

All 56 images were captured with isolated Chromium color-scheme and reduced-motion emulation. No system settings were changed. Desktop: 1280 × 1000. Phone: 390 × 844. Full-page images include content below the viewport. The brief stories use the existing clean-start option so initial source and reasoning panels do not obscure the page structure.

| Persona and tab | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya · Needs you | [Light](maya-needs-you-desktop-light.jpg) | [Dark](maya-needs-you-desktop-dark.jpg) | [Light](maya-needs-you-phone-light.jpg) | [Dark](maya-needs-you-phone-dark.jpg) |
| Maya · Heads-up | [Light](maya-heads-up-desktop-light.jpg) | [Dark](maya-heads-up-desktop-dark.jpg) | [Light](maya-heads-up-phone-light.jpg) | [Dark](maya-heads-up-phone-dark.jpg) |
| Maya · Other mail | [Light](maya-other-mail-desktop-light.jpg) | [Dark](maya-other-mail-desktop-dark.jpg) | [Light](maya-other-mail-phone-light.jpg) | [Dark](maya-other-mail-phone-dark.jpg) |
| Daniel · Needs you | [Light](daniel-needs-you-desktop-light.jpg) | [Dark](daniel-needs-you-desktop-dark.jpg) | [Light](daniel-needs-you-phone-light.jpg) | [Dark](daniel-needs-you-phone-dark.jpg) |
| Daniel · Heads-up | [Light](daniel-heads-up-desktop-light.jpg) | [Dark](daniel-heads-up-desktop-dark.jpg) | [Light](daniel-heads-up-phone-light.jpg) | [Dark](daniel-heads-up-phone-dark.jpg) |
| Daniel · Other mail | [Light](daniel-other-mail-desktop-light.jpg) | [Dark](daniel-other-mail-desktop-dark.jpg) | [Light](daniel-other-mail-phone-light.jpg) | [Dark](daniel-other-mail-phone-dark.jpg) |
| Sarah · Needs you | [Light](sarah-needs-you-desktop-light.jpg) | [Dark](sarah-needs-you-desktop-dark.jpg) | [Light](sarah-needs-you-phone-light.jpg) | [Dark](sarah-needs-you-phone-dark.jpg) |
| Sarah · Heads-up | [Light](sarah-heads-up-desktop-light.jpg) | [Dark](sarah-heads-up-desktop-dark.jpg) | [Light](sarah-heads-up-phone-light.jpg) | [Dark](sarah-heads-up-phone-dark.jpg) |
| Sarah · Other mail | [Light](sarah-other-mail-desktop-light.jpg) | [Dark](sarah-other-mail-desktop-dark.jpg) | [Light](sarah-other-mail-phone-light.jpg) | [Dark](sarah-other-mail-phone-dark.jpg) |

| Additional state | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya, Done and Snooze receipts | [Light](maya-done-snoozed-desktop-light.jpg) | [Dark](maya-done-snoozed-desktop-dark.jpg) | [Light](maya-done-snoozed-phone-light.jpg) | [Dark](maya-done-snoozed-phone-dark.jpg) |
| Maya, all done with Undo receipts | [Light](maya-all-done-desktop-light.jpg) | [Dark](maya-all-done-desktop-dark.jpg) | [Light](maya-all-done-phone-light.jpg) | [Dark](maya-all-done-phone-dark.jpg) |
| Maya, new mail added to Other mail | [Light](maya-new-mail-desktop-light.jpg) | [Dark](maya-new-mail-desktop-dark.jpg) | [Light](maya-new-mail-phone-light.jpg) | [Dark](maya-new-mail-phone-dark.jpg) |
| Needs you sheet | — | — | [Light](maya-needs-you-detail-phone-light.jpg) | [Dark](maya-needs-you-detail-phone-dark.jpg) |
| Heads-up sheet | — | — | [Light](maya-heads-up-detail-phone-light.jpg) | [Dark](maya-heads-up-detail-phone-dark.jpg) |
| Other mail sheet | — | — | [Light](maya-other-mail-detail-phone-light.jpg) | [Dark](maya-other-mail-detail-phone-dark.jpg) |

The 1024-wide desktop samples show the unresolved label wrapping described below: [light](maya-narrow-desktop-light.jpg), [dark](maya-narrow-desktop-dark.jpg).

Before the structural change: [desktop light](../21-shared-components/brief-desktop-light.jpg), [desktop dark](../21-shared-components/brief-desktop-dark.jpg), [phone light](../21-shared-components/brief-phone-light.jpg), [phone dark](../21-shared-components/brief-phone-dark.jpg). The previous row/detail component review is [task 25](../25-rows-and-details/README.md).

Compared with [Needs you](../../screens/v2/needs-you.png), [done and snoozed](../../screens/v2/needs-you-done.png), [Heads-up](../../screens/v2/heads-up.png), [Other mail](../../screens/v2/other-mail.png), [Daniel](../../screens/v2/daniel.png), [Sarah](../../screens/v2/sarah.png), [phone Needs you](../../screens/v2/phone-needs-you.png), and [phone Heads-up](../../screens/v2/phone-heads-up.png).

## How to review

1. Open Patterns/Brief: Maya, Daniel, and Sarah. Check the initial counts: 3/3/31, 4/3/64, and 3/2/18. Switch tabs with the mouse or arrow keys. Desktop selects the first row of a new tab; phone waits for a tap.
2. Open another row, switch tabs, and return. Sources, reasoning, selected detail view, highlighter choice, Ask answers, and checklist progress remain. KeyboardMaya, KeyboardDaniel, and KeyboardSarah exercise selection, keyboard order, phone focus return, and remembered email state.
3. Open every email's external action. The app follows the explicit account or the persona's main account (not marked minority). Daniel's Car service uses Gmail and has the Personal label; Sarah's Lincoln Elementary uses Yahoo Mail.
4. In Patterns/New mail, Add to brief appends Okto Freight to Needs you and Revenue Ops Digest to Other mail. The counts become 4/3/32 before any completion, with 40 covered emails and “27 more like these” remaining.
5. Patterns/Item lifecycle retains Done, Snooze, Undo, Simulate reply, checklist completion, and AllDone. Patterns/Ask and Patterns/Demo retain their existing interactions and level controls.

## Scope and specification differences

- This PR assembles existing components. No design tokens or persona data changed, and no new design-system component was added.
- The legacy Set aside view, grouped-row entry point, and keep/move session operations leave the app. SectionCard, CollapsedGroup, SetAsideList, and all edge-state stories remain in the library.
- Watchlist, Memory, Move to, and the account menu are later tasks. The avatar remains the existing noninteractive Avatar, and no unavailable navigation or move controls are rendered.
- The demo bar, its theme control, levels, and simulations remain unchanged. The app's existing initial source/reasoning demo settings also remain; the clean-start stories are for visual comparison.
- The written rule keeps panels at their content height; the references draw some equal-height panels. The built NewMailRow, sources with Open email, scene cards, phone dividers, sheet gestures, and Done/Snooze closing behavior remain under D60.
- The reference done/snoozed screen shows “2 of 3 done” while retaining Corvo's completed receipt and a snoozed Halden item. The built lifecycle correctly reports “2 of 4 done”: Corvo and Fernway are done, Halden is unfinished, and Brightline remains open.

## Validation

- App and Storybook builds, lint, formatting, English checks, and data validation pass.
- 88 Playwright checks pass in light/dark and normal/reduced motion. Two Move to scenarios are explicitly marked `fixme` with [task 27 / #59](https://github.com/shuhaoshang/glance-mail/issues/59), producing eight skipped project cases.
- The tab checks cover all three personas at 1280, 1024, and 390 widths, every visible email's account destination, one greeting h1, named panels, keyboard order, phone close/focus return, and no horizontal overflow.
- 56 related Storybook stories pass in both themes at 1280 and 390: 224 renders and interaction runs. These include Brief, New mail, Item lifecycle, Ask, and Demo.

## Open questions

1. **Narrow desktop detail navigation:** the specified 80 side padding, 416 list column, and existing segment padding leave little space at 1024. There is no horizontal overflow, but “Details” and “Ask” can break inside words. Proposal: let the detail's position text stay on its own line when the two controls do not fit, with the SegmentedControl below it using the existing `--space-12` gap and its existing padding. No new breakpoint, token, or smaller type would be needed. This layout change is not implemented.
2. **AllDone wording:** D60 preserves the built component, whose body still says “good to know” and “set aside.” Its old Review set aside action is omitted because the view has been removed. Proposal: add an optional Visual 2.0 wording variant: “{done} of {total} actions done. {know} emails in Heads-up and {other} in Other mail.” Keep the existing snoozed sentence when needed and preserve the legacy wording for edge-state/library examples. Awaiting approval.
3. **Watchlist attribution before task 28:** Watchlist is out of scope and its tab is intentionally absent. The existing detail API couples the attribution line to a working Watchlist callback, so these lines are omitted for now. Proposal: allow a name without a callback and render “Based on Watchlist: {name}” / “Part of Watchlist: {name}” as plain text until #60 connects the links. No inert link or placeholder destination has been added.
