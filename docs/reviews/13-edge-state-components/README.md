# Task 13 component review

Open **Composites/Notice** and **Primitives/Skeleton** in Storybook. The examples are captured at 390 px wide in an isolated browser. The full edge-state patterns follow after component review.

| Example | Light | Dark |
| --- | --- | --- |
| Notice with Reconnect | [Light](notice-light.jpg) | [Dark](notice-dark.jpg) |
| Skeleton row with shimmer | [Light](skeleton-light.jpg) | [Dark](skeleton-dark.jpg) |
| Skeleton row with reduced motion | [Light](skeleton-light-reduced.jpg) | [Dark](skeleton-dark-reduced.jpg) |

Compare with the [disconnected screen](../../screens/phone-disconnected.png) and the [first brief screen](../../screens/phone-first-brief.png).

The Notice story verifies one primary action, keyboard focus, and callback invocation. The Skeleton row renders empty decorative bars. Browser emulation verified the 1.6 second shimmer and the static sunken fill in both themes.
