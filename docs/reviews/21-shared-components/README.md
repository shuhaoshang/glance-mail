# Shared components · Visual 2.0

Task 21 / [Issue #53](https://github.com/shuhaoshang/glance-mail/issues/53), based on main at `f460424` after PR #65.

The shared components now use the Visual 2.0 selection, fact-chip, panel, reasoning, and action-bar rules in design-system sections 9.4–9.6. The reference comparison uses `needs-you.png`, `needs-you-why.png`, and `needs-you-source.png` under `docs/screens/v2/`.

## Before and after

The before images are the main-branch captures from task 20. Desktop captures use a 1280 × 1000 viewport and include the full page. Phone captures use 390 × 844; the new phone images show exactly the viewport so the pinned action bar is easy to review.

| View | Before | After |
| --- | --- | --- |
| Desktop, light | [Before](../20-tokens-2/after-desktop-light.jpg) | [After](brief-desktop-light.jpg) |
| Desktop, dark | [Before](../20-tokens-2/after-desktop-dark.jpg) | [After](brief-desktop-dark.jpg) |
| Phone, light | [Before](../20-tokens-2/after-phone-light.jpg) | [After](brief-phone-light.jpg) |
| Phone, dark | [Before](../20-tokens-2/after-phone-dark.jpg) | [After](brief-phone-dark.jpg) |

## State evidence

| State | Light | Dark |
| --- | --- | --- |
| Phone detail and default actions | [Light](detail-phone-light.jpg) | [Dark](detail-phone-dark.jpg) |
| Open reasoning | [Light](reason-desktop-light.jpg) | [Dark](reason-desktop-dark.jpg) |
| Exact source with Open email and close | [Light](source-desktop-light.jpg) | [Dark](source-desktop-dark.jpg) |
| Completed checklist and primary Mark done | [Light](checklist-phone-light.jpg) | [Dark](checklist-phone-dark.jpg) |
| BriefRow default, hover, pressed, focus, selected, selected hover, selected pressed, and new | [Light](row-states-light.jpg) | [Dark](row-states-dark.jpg) |
| Small segments: selected keyboard focus beside a hovered tab | [Light](small-segments-focus-light.jpg) | [Dark](small-segments-focus-dark.jpg) |
| Optional Watchlist footer | [Light](watchlist-footer-light.jpg) | [Dark](watchlist-footer-dark.jpg) |

The small-segment images are 1280-wide crops of the top 160 pixels, captured from the desktop viewport. Other desktop screenshots include the full rendered page. Themes and reduced motion were emulated in isolated headless Chromium contexts. No computer settings were changed.

## Review in Storybook

- Primitives/SegmentedControl: default and small states, selected hover/press, adjacent focus/hover, disabled-tab keyboard navigation. Small segments are 24 tall with a 44-pixel hit target.
- Primitives/FactChip: Money, Time, People, and Urgent. Only urgent chips keep the dot.
- Composites/BriefRow: States and KeyboardSelection. A selected row keeps its surface, ring, and shadow during real hover and press.
- Primitives/ReasonPill: Default, NoJudgment, ElevenItems, Toggle, SmallTarget, and PhoneWrapped. The eleven supplied items demonstrate word ordinals through tenth and “Why it’s ranked 11th.”
- Composites/ReasonPanel: Evidence and Watchlist. The Watchlist example uses the supplied version 2 name and a verified callback; product wiring belongs to task 28.
- Composites/DetailPanel: Actions, ActionsHover, ActionsPressed, ActionsFocus, Busy, SnoozeOpen, ChecklistComplete, VerifySources, and EscapeDisclosures.
- Patterns/Ask and Patterns/Item lifecycle: verify Ask through the third tab, the pinned phone actions, Done, Snooze, Undo, and checklist completion.
- Composites/SectionCard, CollapsedGroup, Notice, and SnoozeMenu: the panel shadow changes; their existing structure and behavior remain.

## Validation

- App and Storybook production builds, lint, formatting, data validation, and the English-only check pass.
- All 32 Playwright checks pass: the three persona flows, Foundations, and four shared-component checks in light/dark with normal/reduced motion. These tests run in the existing GitHub Actions workflow.
- All 141 affected Storybook stories pass in light/dark at 1280 and 390 widths with reduced motion: 564 story renders and their interaction functions, with no runtime or interaction failures.
- Browser assertions cover selected fills during real pointer down, chip colors and dots, keyboard navigation and focus stacking, small-control hit areas, reasoning labels/disclosure, Watchlist callback, exactly one primary action, compact/touch sizes, equal phone secondary widths, and the open Snooze menu's pressed fill.
- Existing tokens and persona data are unchanged. The 28-pixel detail padding is composed from the supplied 24 and 4 spacing tokens.

## Scope and migration

As explicitly required by task 21, the old “Not for you?” correction block and Move to Set aside entry point are removed. Their action-dependent pattern stories are retired until task 27 introduces Move to. Done, Snooze, Undo, keeping Set aside mail, adding new mail, and all persona counts remain covered. Maya's reasoning step now checks that the removed footer is absent.

The existing section layout remains until the later tab-layout task. Scene cards, source controls, email highlighting, the demo bar, phone sheet gestures, and edge-state patterns remain as built under D60. No new component, token, live version 2 data, or later-task feature is introduced.

## Open questions

None. This issue explicitly defines the temporary removal of the old correction entry point and defers Move to and Watchlist wiring to later tasks.
