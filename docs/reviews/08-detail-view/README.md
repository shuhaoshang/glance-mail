# Task 08 review: detail views

The existing brief detail card now includes scene cards, sources, Glance's reasoning, and the original email. On phone, selecting a row opens the same content in a modal sheet.

## Screenshot matrix

Desktop captures use a 1280 px viewport. Phone captures use 390 × 844. Details captures on desktop retain the supplied demo defaults: Maya's contract source, Daniel's reasoning, and Sarah's fee source. Phone opens start with no source or reasoning expanded.

| Persona | View | Light | Dark |
| --- | --- | --- | --- |
| Maya | desktop details | [Light](maya-desktop-details-light.jpg) | [Dark](maya-desktop-details-dark.jpg) |
| Maya | desktop email | [Light](maya-desktop-email-light.jpg) | [Dark](maya-desktop-email-dark.jpg) |
| Maya | phone details | [Light](maya-phone-details-light.jpg) | [Dark](maya-phone-details-dark.jpg) |
| Maya | phone email | [Light](maya-phone-email-light.jpg) | [Dark](maya-phone-email-dark.jpg) |
| Daniel | desktop details | [Light](daniel-desktop-details-light.jpg) | [Dark](daniel-desktop-details-dark.jpg) |
| Daniel | desktop email | [Light](daniel-desktop-email-light.jpg) | [Dark](daniel-desktop-email-dark.jpg) |
| Daniel | phone details | [Light](daniel-phone-details-light.jpg) | [Dark](daniel-phone-details-dark.jpg) |
| Daniel | phone email | [Light](daniel-phone-email-light.jpg) | [Dark](daniel-phone-email-dark.jpg) |
| Sarah | desktop details | [Light](sarah-desktop-details-light.jpg) | [Dark](sarah-desktop-details-dark.jpg) |
| Sarah | desktop email | [Light](sarah-desktop-email-light.jpg) | [Dark](sarah-desktop-email-dark.jpg) |
| Sarah | phone details | [Light](sarah-phone-details-light.jpg) | [Dark](sarah-phone-details-dark.jpg) |
| Sarah | phone email | [Light](sarah-phone-email-light.jpg) | [Dark](sarah-phone-email-dark.jpg) |

Before: [desktop Maya reference](../../screens/desktop-maya.png), [desktop Daniel reference](../../screens/desktop-daniel.png), [desktop Sarah reference](../../screens/desktop-sarah.png), [desktop email reference](../../screens/desktop-maya-email.png), [phone detail reference](../../screens/phone-detail.png), and [phone email reference](../../screens/phone-email.png). Later-task controls in those references are outside this issue.

## Phone interaction sequence

Each dismissal starts by reopening Sarah's Lincoln Elementary row with the keyboard. Focus enters the Close detail button. After dismissal, the active element is the original row and the body scroll lock is removed. Pointer dismissals return focus without forcing a keyboard-only focus ring.

| Step | Light | Dark |
| --- | --- | --- |
| Open from the row; focus enters Close detail | [Open](phone-open-light.jpg) | [Open](phone-open-dark.jpg) |
| Activate Close detail; focus returns to the row | [Close button](phone-close-button-light.jpg) | [Close button](phone-close-button-dark.jpg) |
| Reopen, then click the scrim | [Scrim](phone-close-scrim-light.jpg) | [Scrim](phone-close-scrim-dark.jpg) |
| Reopen, then press Escape | [Escape](phone-close-escape-light.jpg) | [Escape](phone-close-escape-dark.jpg) |
| Reopen before dragging the handle | [Before drag](phone-drag-before-light.jpg) | [Before drag](phone-drag-before-dark.jpg) |
| Drag the handle down; focus returns to the row | [After drag](phone-close-drag-light.jpg) | [After drag](phone-close-drag-dark.jpg) |
| Select the fee and scroll to its source; the action bar stays fixed | [Source](sarah-phone-source-light.jpg) | [Source](sarah-phone-source-dark.jpg) |

The dialog top is 56 px. At 390 × 844, the footer stays at y=763–844 while the source scrolls fully above it. Shift+Tab from Close detail wraps to the inbox link; Tab returns to Close detail. The background is inert while open.

## Validation

- Node 24: dependency installation, app build, Storybook build, ESLint, Prettier checks, and `check:english`.
- Storybook interaction tests: all three Brief keyboard stories at desktop and narrow widths; DetailPanel source verification and checklist preservation; EmailView highlighter; ReasonPanel evidence; DetailSheet focus and dismissal in both themes.
- Every Maya scene field opens the exact mapped source highlight and returns focus to the field when closed.
- Switching tabs preserves checklist and highlighter state. Clicking the currently selected desktop row preserves the active tab and highlighter state.
- The only primary action opens the correct provider inbox in a new tab. No detail link points to `#`.
- Native browser checks cover close button, scrim, Escape, and physical handle dragging, including focus return. Storybook tests exercise the native cancel event separately because synthetic keyboard events do not perform browser default actions.
- With the system's Reduce motion setting enabled, sheet and scrim animations are `none`, source ink appears immediately, and email highlight transitions are `0s`. Closing still restores row focus. The original system setting was restored after testing.
- The integrated app honors `?start=clean`; normal desktop demo entry uses the supplied initial source/reasoning state.

## Reference differences for review

- The written EmailView specification defines four legend types. All four remain visible on phone, although the supplied phone email screenshot shows three.
- The close icon stays inside its 44 px target without negative margins, following the spacing rule.
- Ask, Done, Snooze, Mark done, and classification actions belong to later tasks and are not rendered here.
- D44 does not specify a drag distance or velocity threshold. The sheet currently recognizes a completed downward-dominant handle drag without adding an arbitrary threshold or a live-follow animation.
