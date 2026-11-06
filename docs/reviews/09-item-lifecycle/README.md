# Task 09 review: item lifecycle

Done, Snooze, Move to Set aside, Undo, checklist completion, and the demo reply control now share one session state. Desktop selects the first remaining item after its selected item leaves. Phone actions close the sheet and show the result in the brief.

## Screenshot matrix

Desktop captures use the user-flow viewport of 1280 × 800; phone captures use 390 × 844. Some desktop views are scrolled to the action bar, and phone reasoning views are scrolled to the correction action. The desktop checklist capture closes its source to match the supplied checked reference.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Manual Done | [Light](desktop-done-light.jpg) | [Dark](desktop-done-dark.jpg) | [Light](phone-done-light.jpg) | [Dark](phone-done-dark.jpg) |
| Snooze menu | [Light](desktop-snooze-light.jpg) | [Dark](desktop-snooze-dark.jpg) | [Light](phone-snooze-light.jpg) | [Dark](phone-snooze-dark.jpg) |
| Snoozed result | [Light](desktop-snoozed-light.jpg) | [Dark](desktop-snoozed-dark.jpg) | [Light](phone-snoozed-light.jpg) | [Dark](phone-snoozed-dark.jpg) |
| Move to Set aside action | [Light](desktop-move-to-set-aside-light.jpg) | [Dark](desktop-move-to-set-aside-dark.jpg) | [Light](phone-move-to-set-aside-light.jpg) | [Dark](phone-move-to-set-aside-dark.jpg) |
| Moved result | [Light](desktop-moved-light.jpg) | [Dark](desktop-moved-dark.jpg) | [Light](phone-moved-light.jpg) | [Dark](phone-moved-dark.jpg) |
| After Undo | [Light](desktop-undo-light.jpg) | [Dark](desktop-undo-dark.jpg) | [Light](phone-undo-light.jpg) | [Dark](phone-undo-dark.jpg) |
| Sarah: both steps checked | [Light](desktop-checklist-complete-light.jpg) | [Dark](desktop-checklist-complete-dark.jpg) | [Light](phone-checklist-complete-light.jpg) | [Dark](phone-checklist-complete-dark.jpg) |
| All actions done | [Light](desktop-all-done-light.jpg) | [Dark](desktop-all-done-dark.jpg) | [Light](phone-all-done-light.jpg) | [Dark](phone-all-done-dark.jpg) |
| All remaining items snoozed | [Light](desktop-snoozed-empty-light.jpg) | [Dark](desktop-snoozed-empty-dark.jpg) | [Light](phone-snoozed-empty-light.jpg) | [Dark](phone-snoozed-empty-dark.jpg) |
| Demo reply control | [Light](desktop-simulate-ready-light.jpg) | [Dark](desktop-simulate-ready-dark.jpg) | [Light](phone-simulate-ready-light.jpg) | [Dark](phone-simulate-ready-dark.jpg) |
| Simulated reply detected | [Light](desktop-simulated-reply-light.jpg) | [Dark](desktop-simulated-reply-dark.jpg) | [Light](phone-simulated-reply-light.jpg) | [Dark](phone-simulated-reply-dark.jpg) |
| Sarah: two of three done | [Light](desktop-sarah-flow-light.jpg) | [Dark](desktop-sarah-flow-dark.jpg) | [Light](phone-sarah-flow-light.jpg) | [Dark](phone-sarah-flow-dark.jpg) |

On phone, the expanded demo controls and the result row need separate views: [simulated result, light](phone-simulated-result-light.jpg) · [simulated result, dark](phone-simulated-result-dark.jpg).

References: [desktop all done](../../screens/desktop-all-done.png), [phone done](../../screens/phone-done.png), [Sarah checked](../../screens/desktop-sarah-checked.png).

## Flow and count checks

| Flow | Needs you | Progress | Set aside |
| --- | --- | --- | --- |
| Maya initial | 3 | 1 of 4 done | 31 |
| Maya reply to Priya detected | 2 | 2 of 4 done | 31 |
| Undo reply detection | 3 | 1 of 4 done | 31 |
| Move Halden Health to Set aside | 2 | 1 of 3 done | 32 |
| Undo Halden move | 3 | 1 of 4 done | 31 |
| Daniel reply to Sam detected | 3 | 2 of 5 done | 64 |
| Daniel also marks Jordan's expense done | 2 | 3 of 5 done | 64 |
| Undo Jordan's expense | 3 | 2 of 5 done | 64 |
| Sarah marks Lincoln done | 2 | 1 of 3 done | 18 |
| Sarah also replies to Riverside | 1 | 2 of 3 done | 18 |

Snooze leaves the action total unchanged and never increases done. Move to Set aside removes one action from the total and increases Set aside. Coverage remains conserved: Needs you + Good to know + Set aside + done + snoozed equals the supplied email count. Undo restores the original order without reopening a phone sheet.

## Validation

- Node 24: locked dependency installation, TypeScript/app build, Storybook build, ESLint, Prettier, and American English checks.
- Storybook flow tests cover Maya 6 and her correction branch, Daniel 5–6, Sarah 4–5, mixed Done/Snooze/Move/Undo sequences, all done, and all snoozed.
- Phone primary actions stay 48 px; neutral secondary actions use the specified 44 px target.
- Sarah's final tick changes only the action bar and note: Mark done is the sole primary, Open in Yahoo Mail becomes neutral, and Snooze disappears. Unticking restores the default bar. Checklist notes persist through tab changes and Undo.
- Snooze opens above the action bar without moving the body. Focus enters its options. Escape closes the menu and returns to Snooze; it does not close the phone sheet.
- Normal row removal uses the supplied collapse token. With the system Reduce motion preference enabled, the removed row is absent immediately; flow/count tests also pass. The system preference was restored after testing.
- A phone action closes its sheet, releases the scroll lock, and places focus on the result's Undo button because the opening row no longer exists. Undo returns focus to the restored row.
- Reply simulation uses each persona's supplied target, note, detected label, and already-done label. Simulation also works in Plain/Formatted demo levels. No reply is sent.
- Previously completed rows keep their original notes and have no Undo.

## Review follow-up and scope

Ask belongs to task 10; the Set aside view and Review set aside action belong to task 12. This task updates its count and retains moved items for that later view.

The review confirmed the empty heading: use “Nothing else needs you right now” whenever snoozed items will return, and “Nothing else needs you today” only when nothing is snoozed. The specifications and product brief now match.

SnoozeMenu remains an overlay and uses the approved surface fill, strong hairline ring, and popover shadow. The shadow token is defined for light, automatic dark, and explicit dark themes.

Rows with Undo use the reference padding and contain a separate 44 px target; adjacent targets are checked for overlap. Phone Snooze and Done share the second row equally, and the single neutral Open action fills it after checklist completion. Primary and secondary heights remain 48 and 44 px.

Regression checks cover both empty headings, the existing lifecycle counts, adjacent Undo target bounds at desktop and phone widths, and equal phone action widths.
