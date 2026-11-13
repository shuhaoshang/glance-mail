# Tokens 2.0 review

Maya's production brief at the same viewport sizes and browser preferences before and after the token update.

| Viewport | Before | After | Visual 2.0 reference |
| --- | --- | --- | --- |
| Desktop, 1280 × 1000, light | [Capture](before-desktop-light.jpg) | [Capture](after-desktop-light.jpg) | [Needs you](../../screens/v2/needs-you.png) |
| Desktop, 1280 × 1000, dark | [Capture](before-desktop-dark.jpg) | [Capture](after-desktop-dark.jpg) | [Needs you](../../screens/v2/dark-needs-you.png) |
| Phone, 390 × 844, light | [Capture](before-phone-light.jpg) | [Capture](after-phone-light.jpg) | [Needs you](../../screens/v2/phone-needs-you.png) |
| Phone, 390 × 844, dark | [Capture](before-phone-dark.jpg) | [Capture](after-phone-dark.jpg) | [Needs you](../../screens/v2/phone-dark-needs-you.png) |

The full-page captures show the tinted background and glows, 28 px panels, and amber time accents in the existing brief. The desktop list and detail gap computes to 12 px. The medium-weight greeting computes to 40/48 on desktop and 28/32 on phone. Red remains on urgent marks. The tab layout and shared component restyling follow in later issues.

## Muted text contrast

Chromium rendered the production brief in each theme and viewport. To sample the background beneath each muted text region on the page, the check captured the same layout with foreground elements hidden. It compared the computed foreground with the lightest or darkest rendered pixels using relative luminance. Ratios below are the minimum across the sampled regions.

| Viewport | Light | Dark |
| --- | --- | --- |
| Desktop | 5.06:1 | 7.27:1 |
| Phone | 4.75:1 | 6.69:1 |

All four minimums exceed 4.5:1. The Playwright Foundations check verifies that the built catalog displays every supplied token in both themes.
