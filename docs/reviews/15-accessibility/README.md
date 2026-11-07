# Accessibility and polish review

## What was checked

The production build was checked in an isolated Chrome browser. Accessibility was inspected through the browser accessibility tree and axe-core 4.14.0. Color scheme and reduced motion were emulated in the browser.

- 72 axe scans covered the brief, details, a source, original email, Ask, and Set aside for Maya, Daniel, and Sarah at 390 px and 1280 px in both themes. The final scans reported zero violations for the selected WCAG 2 A/AA, WCAG 2.1 AA, and best-practice rules.
- The browser tree exposed names and roles for buttons, tabs, fields, checkboxes, and switches. Field labels included their value and source action. Chip text included type and urgency. Progress and new mail exposed live-region semantics. Actual spoken announcements remain part of the real screen-reader pass.
- Native keyboard input checked entering the phone sheet, forward and reverse Tab containment, visible field focus, nested Escape behavior, and return to the opening row. Storybook regressions checked source and reasoning closure, KnowRow sources, menu and lifecycle actions, and demo controls.
- Measured phone buttons, links, and inputs reached 44 × 44. Checkbox and small ReasonPill targets retained their documented sizing. Inline email highlight targets remain an open question below.
- Fourteen representative Storybook checks covered reduced-motion behavior for the motion catalog, Skeleton, Highlight, ProgressBar, Switch, source disclosures, item lifecycle, menus, Ask, Set aside, edge states, and Demo controls. Application canvas animations and transitions resolved to at most 1 ms or none. Source inspection confirmed the animation families use the motion tokens.
- The brief reflowed at 320 px without horizontal overflow for all three personas in both themes. Hover and pressed states continue to use state colors, and keyboard focus uses the existing focus tokens.
- Lighthouse 13.6.0 scored accessibility at 100 for every persona with its desktop and mobile presets on the local production build.

## What was fixed

- Escape closes a source or reasoning disclosure and restores its trigger before the surrounding sheet handles Escape. Previously, a phone source could remain open while Escape closed the entire sheet; desktop source disclosures did not close with Escape.
- Phone compact buttons, icon buttons, tabs, Demo choices, and Fields now have a minimum 44 × 44 target. Inline Fields reserve the additional height, so some lines are taller.
- The design-system accessibility section now records the phone target priority over the earlier compact 40 px examples.

## Lighthouse screenshots

| Persona | Mobile | Desktop |
| --- | --- | --- |
| Maya | [100](lighthouse-maya-mobile.jpg) | [100](lighthouse-maya-desktop.jpg) |
| Daniel | [100](lighthouse-daniel-mobile.jpg) | [100](lighthouse-daniel-desktop.jpg) |
| Sarah | [100](lighthouse-sarah-mobile.jpg) | [100](lighthouse-sarah-desktop.jpg) |

## Visual checks

Compare the [previous phone brief](../14-app-dark-theme/phone-sarah-system-dark.jpg) and [previous detail view](../14-app-dark-theme/phone-detail-dark.jpg) with the updated targets.

| View | Light | Dark |
| --- | --- | --- |
| Brief with larger inline Field targets | [Light](phone-brief-light.jpg) | [Dark](phone-brief-dark.jpg) |
| Focused checklist Field and source | [Light](phone-source-light.jpg) | [Dark](phone-source-dark.jpg) |

## What is left

- A real screen-reader pass must verify spoken Field and urgent-chip labels, announcement timing for progress and new mail, reading order, source context, and sheet entry and focus return. Browser accessibility-tree assertions do not verify how VoiceOver, NVDA, or TalkBack actually announce them.
- Real mobile assistive-technology testing should cover swipe navigation, touch exploration, and interaction with inline email highlights.
- Inline email highlights remain approximately 22 px tall in the sample email. Their purpose is exposed by their title in the browser tree, while visual tooltip behavior relies on the browser. Their target and label interaction need the design decision below.
- Browser zoom, text-only zoom, and additional browser/assistive-technology combinations need a manual pass beyond the 320 px reflow check.

## Open questions

The original-email highlights preserve sentence layout and are keyboard-focusable, but are smaller than the task's 44 px rule. Propose an explicit inline-text exception with the full purpose available as an accessible description, or a separately designed 44 px annotation control that shows the purpose on tap and focus. Confirm the intended interaction before changing the email layout.
