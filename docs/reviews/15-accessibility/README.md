# Accessibility and polish review

## What was checked

The production build was checked in an isolated Chrome browser. Accessibility was inspected through the browser accessibility tree and axe-core 4.14.0. Color scheme and reduced motion were emulated in the browser.

- 72 axe scans covered the brief, details, a source, original email, Ask, and Set aside for Maya, Daniel, and Sarah at 390 px and 1280 px in both themes. The final scans reported zero violations for the selected WCAG 2 A/AA, WCAG 2.1 AA, and best-practice rules.
- The browser tree exposed names and roles for buttons, tabs, fields, checkboxes, and switches. Field labels included their value and source action. Chip text included type and urgency. Progress and new mail exposed live-region semantics. Actual spoken announcements remain part of the real screen-reader pass.
- Native keyboard input checked entering the phone sheet, forward and reverse Tab containment, visible field focus, nested Escape behavior, and return to the opening row. Storybook regressions checked source and reasoning closure, KnowRow sources, menu and lifecycle actions, and demo controls.
- Twenty-nine browser point-hit cases checked transparent target extensions on Fields, compact buttons and icon buttons, tabs, and Demo choices at phone and desktop widths. Visible controls stay above neighboring extensions. Adjacent fallback Fields divide the existing gap at its midpoint. Checkbox and small ReasonPill retain their D46 targets.
- Email highlights have no Tab stops. Their types are exposed as text in the accessibility tree, and their title labels remain available on mouse hover.
- Fourteen representative Storybook checks covered reduced-motion behavior for the motion catalog, Skeleton, Highlight, ProgressBar, Switch, source disclosures, item lifecycle, menus, Ask, Set aside, edge states, and Demo controls. Application canvas animations and transitions resolved to at most 1 ms or none. Source inspection confirmed the animation families use the motion tokens.
- The brief reflowed at 320 px without horizontal overflow for all three personas in both themes. Hover and pressed states continue to use state colors, and keyboard focus uses the existing focus tokens.
- Lighthouse 13.6.0 scored accessibility at 100 for every persona with its desktop and mobile presets on the local production build.

## What was fixed

- Escape closes a source or reasoning disclosure and restores its trigger before the surrounding sheet handles Escape. Previously, a phone source could remain open while Escape closed the entire sheet; desktop source disclosures did not close with Escape.
- Small controls now extend their targets invisibly at every width. Their visible dimensions, line heights, selected fills, and focus outlines retain the original geometry.
- The accessibility and EmailView specifications now describe invisible hit targets and nonfocusable, type-labeled highlights.

## Lighthouse screenshots

| Persona | Mobile | Desktop |
| --- | --- | --- |
| Maya | [100](lighthouse-maya-mobile.jpg) | [100](lighthouse-maya-desktop.jpg) |
| Daniel | [100](lighthouse-daniel-mobile.jpg) | [100](lighthouse-daniel-desktop.jpg) |
| Sarah | [100](lighthouse-sarah-mobile.jpg) | [100](lighthouse-sarah-desktop.jpg) |

## Visual checks

The pairs below use 390 × 844, the same scroll positions, and the same focused Field. Before shows the earlier minimum-size fix; After shows the invisible extension.

| View | Before | After |
| --- | --- | --- |
| Light brief | [Before](phone-brief-light-before.jpg) | [After](phone-brief-light.jpg) |
| Dark brief | [Before](phone-brief-dark-before.jpg) | [After](phone-brief-dark.jpg) |
| Light source | [Before](phone-source-light-before.jpg) | [After](phone-source-light.jpg) |
| Dark source | [Before](phone-source-dark-before.jpg) | [After](phone-source-dark.jpg) |

## What is left

- A real screen-reader pass must verify spoken Field and urgent-chip labels, announcement timing for progress and new mail, reading order, source context, and sheet entry and focus return. Browser accessibility-tree assertions do not verify how VoiceOver, NVDA, or TalkBack actually announce them.
- Real mobile assistive-technology testing should cover swipe navigation, touch exploration, and the type text in original-email annotations.
- Browser zoom, text-only zoom, and additional browser/assistive-technology combinations need a manual pass beyond the 320 px reflow check.

## Open questions

None. The designer confirmed that email highlights are annotations rather than controls and should not be focusable.
