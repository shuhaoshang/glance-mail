# Task 14 app theme review

The desktop captures are 1280 × 900. The phone captures are 390 × 844. Color scheme and reduced motion were emulated in an isolated browser.

| View | Preview |
| --- | --- |
| Desktop before the theme switch | [Light](desktop-before-light.jpg) |
| Desktop with the theme switch | [System on light](desktop-after-light.jpg) · [System on dark](desktop-system-dark.jpg) |
| Daniel desktop | [Dark override](desktop-daniel-dark.jpg) |
| Plain and formatted levels | [Plain](desktop-plain-dark.jpg) · [Formatted](desktop-formatted-dark.jpg) |
| Sarah phone brief | [System on dark](phone-sarah-system-dark.jpg) · [Design reference](../../screens/phone-brief-dark.png) |
| Maya phone brief | [Dark](phone-maya-dark.jpg) |
| Phone Demo panel | [Dark override](phone-demo-dark.jpg) |
| Phone item views | [Details](phone-detail-dark.jpg) · [Original email](phone-email-dark.jpg) |

- System followed live browser color changes. Light and Dark overrode the browser in the opposite scheme and survived reloads. Returning to System removed the override.
- The selection survived persona and level changes. With storage blocked, the app started in System and still applied choices for the current page.
- Dark app checks covered Details, Original email, Ask, and Set aside for all three personas at phone and desktop widths. Storybook retains its theme toolbar.
- The dark muted-text spot check ranged from 5.40:1 to 7.27:1 across the four surface tokens. Urgent-chip text was 5.66:1 in both themes. The source scan found no raw colors in component styles or icons.
