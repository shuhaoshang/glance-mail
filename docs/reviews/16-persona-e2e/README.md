# Task 16 review

The suite runs against production Vite and Storybook builds in Playwright's bundled Chromium headless shell. It includes all 23 documented steps, repeated in light, dark, light with reduced motion, and dark with reduced motion.

| Journey | Steps | Local result |
| --- | --- | --- |
| Maya | 8 | Passed in all four projects |
| Daniel | 8 | Passed in all four projects |
| Sarah | 7 | Sarah 1 fails the full-row viewport check in all four projects; Sarah 2–7 pass |

## Sarah 1 viewport evidence

The app at 390 × 844 exposes about 58% of the Set aside row on the initial screen.

[Light screenshot](sarah-first-screen-light.png) · [Dark screenshot](sarah-first-screen-dark.png)

The test interprets “everything up to the Set aside row fits on one screen” as including the full row. The screenshots show the current app, including the Demo bar. The failing assertion is retained, and no application layout or fixture copy is changed in this PR.

## Open questions

Should Sarah 1 require the entire Set aside row in the 390 × 844 viewport, or only require all preceding content and the beginning of that row? Propose keeping the full-row requirement and addressing the layout in a separate approved fix. If the intent excludes the demo chrome or permits a partial Set aside row, clarify the flow before changing the assertion.

## Review and CI

Open the GitHub Actions artifact named playwright-report for per-step assertions, failure screenshots, and traces. The report attaches the initial Sarah 1 screenshot before continuing the remaining steps. The test job remains red while this flow question is unresolved.

The new dev dependency, @playwright/test, provides the requested Chromium runner, browser contexts, user-facing locators, automatic assertions, and failure artifacts. Browser preferences and viewport are emulated within Playwright.
