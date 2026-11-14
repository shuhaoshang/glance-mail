# Persona end-to-end tests

The three specs follow the Given / When / Then blocks in [the user flows](../docs/user-flows.md), using 8 Maya steps, 8 Daniel steps, and 7 Sarah steps. Assertions import persona copy from the JSON fixtures. Visible elements are located through roles, accessible names, and text.

## Run locally

Use Node 24.

```sh
npm ci
npx playwright install chromium --only-shell
npm run test:e2e
```

The command builds the app and Storybook, starts two Vite preview servers, and runs Chromium headless. The servers stop when the run ends. Occupied test ports cause an error so an old build cannot be mistaken for the current build.

Every journey runs in light and dark, with normal and reduced motion. Maya and Daniel use 1280 × 800; Sarah and Daniel's Quiet hours step use 390 × 844. Browser preferences and storage are isolated from the viewer's browser profile.

The existing start=clean entry point starts each app flow with sources and reasoning closed. Pattern steps use the built Patterns/Edge states stories. Outlook navigation is intercepted after the UI click to verify the new-tab destination without depending on an email service.

## Reports and focused runs

```sh
npm run test:e2e:report
npx playwright test e2e/maya.spec.ts --project=light
```

The focused command uses the most recent production builds. Run the full command after source changes.

Failure screenshots and traces are in test-results/; the HTML report is in playwright-report/. The JSON report is test-results/results.json. GitHub Actions uploads both directories for seven days, including when the tests fail.

Tests use auto-waiting assertions. The collapse check verifies the configured duration (320 ms, or 1 ms with reduced motion) and waits for the row to leave through Playwright assertions.

## Viewport checks

One-screen checks measure from the top of the product's main landmark to the bottom of the required content, and require the full distance to fit within the configured viewport height. Demo controls above the product are excluded.

Sarah 1 includes the entire Set aside row. Sarah 7 includes the entire Needs you section, including Show 8 more, as required by the overload flow. The assertions use bounding boxes and Playwright polling, so scrolling cannot turn a partial-row measurement into a pass.

See [the review evidence](../docs/reviews/16-persona-e2e/README.md) for the viewport context.

## Visual 2.0 migration

Task 21 changes the reasoning trigger to “Why it’s first” and keeps Ask in its view tab. Maya’s reasoning step verifies that the old correction footer is absent. Removing that entry point is intentional until task 27 introduces Move to; the remaining persona steps and their counts still run in every theme and motion mode.

The shared-component spec also checks selection during real hover and press, compact-segment keyboard and touch behavior, the eleven-item reasoning example, the optional Watchlist callback, and desktop/phone action-bar geometry. Storybook interaction functions must finish without errors before assertions continue.

Task 22 adds TabBar and HeaderButton checks for the two named keyboard groups, linked panels, news states, pointer states, and 44-pixel hit areas. The 390-pixel layout check verifies equal tab widths, single-line names/counts, and keyboard activation of the phone header buttons. These are isolated Storybook examples; the application remains on its current layout.

Task 23 adds feedback-component checks: MoveMenu keyboard and outside-click dismissal, blocked current destinations, Toast replacement/expiration with controlled browser time, combined hover/focus pause, Undo once, focused replacement, phone placement above a resized sheet footer, and TextInput/InlineForm naming and keyboard submission. The tests operate only on component examples and do not move any email.
