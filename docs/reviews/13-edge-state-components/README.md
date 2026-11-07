# Task 13 component review

Open **Composites/Notice** and **Primitives/Skeleton** in Storybook. The examples are captured at 390 px wide in an isolated browser. The full edge-state patterns follow after component review.

| Example | Light | Dark |
| --- | --- | --- |
| Notice with Reconnect | [Light](notice-light.jpg) | [Dark](notice-dark.jpg) |
| Skeleton row with shimmer | [Light](skeleton-light.jpg) | [Dark](skeleton-dark.jpg) |
| Skeleton row with reduced motion | [Light](skeleton-light-reduced.jpg) | [Dark](skeleton-dark-reduced.jpg) |

Compare with the [disconnected screen](../../screens/phone-disconnected.png) and the [first brief screen](../../screens/phone-first-brief.png).

The Notice story verifies one primary action, keyboard focus, and callback invocation. The Skeleton row renders empty decorative bars. Browser emulation verified the 1.6 second shimmer and the static sunken fill in both themes.

## Collapsed summaries and static list row

| Example | Light | Dark |
| --- | --- | --- |
| 14 good to know | [Light](good-to-know-light.jpg) | [Dark](good-to-know-dark.jpg) |
| 8 set aside | [Light](set-aside-summary-light.jpg) | [Dark](set-aside-summary-dark.jpg) |
| 210 set aside | [Light](overload-set-aside-light.jpg) | [Dark](overload-set-aside-dark.jpg) |
| 3 set aside | [Light](quiet-hours-set-aside-light.jpg) | [Dark](quiet-hours-set-aside-dark.jpg) |
| Static BriefRow | [Light](static-brief-row-light.jpg) | [Dark](static-brief-row-dark.jpg) |

Open **Composites/CollapsedGroup** to compare the summary examples with Default and **Composites/BriefRow** to compare Static with Default. The browser checks verified the summary labels, chevrons, and selection callback, and that the static row renders its request and fact chip without a button. Existing keyboard selection also passed in both themes.
