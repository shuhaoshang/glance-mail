# Task 16 review

The suite runs against production Vite and Storybook builds in Playwright's bundled Chromium headless shell. It includes all 23 documented steps, repeated in light, dark, light with reduced motion, and dark with reduced motion.

| Journey | Steps | Local result |
| --- | --- | --- |
| Maya | 8 | Passed in all four projects |
| Daniel | 8 | Passed in all four projects |
| Sarah | 7 | Passed in all four projects |

## Product viewport measurement

The designer clarified that one-screen checks measure the product only. The shared assertion measures from the main landmark's top to the bottom of the full required content and requires that distance to be no greater than the viewport height.

Sarah 1 includes the entire Set aside row at 390 × 844. Sarah 7 uses the same product origin and includes the entire Needs you section, including Show 8 more.

[Light viewport context](sarah-first-screen-light.png) · [Dark viewport context](sarah-first-screen-dark.png)

These viewport screenshots include the Demo bar above the product. They provide context for the measurement origin; the strict assertion measures through the bottom of the entire row.

## Open questions

None.

## Review and CI

Open the GitHub Actions artifact named playwright-report for per-step assertions, failure screenshots, and traces. Playwright automatically attaches screenshots on failure.

The new dev dependency, @playwright/test, provides the requested Chromium runner, browser contexts, user-facing locators, automatic assertions, and failure artifacts. Browser preferences and viewport are emulated within Playwright.
