# 16 · End-to-end tests: the three persona flows (Playwright)

**Label:** `chore` · **Depends on:** 09, 10, 12, 13

## Why
`docs/user-flows.md` walks each persona’s story from the first glance to done. Testing the same steps end to end keeps the app true to the stories, not only to each component (decision D36).

## What to build
- Add `@playwright/test` as a dev dependency (say why in the PR, as `AGENTS.md` asks for any new library). Chromium only.
- `npm run test:e2e` runs against the production build (`vite preview`) and the built Storybook.
- **Clean start:** support `?start=clean` in the app. It ignores `demo.initialSelection`, so no source or reason is open on load. Nothing else changes.
- One spec per persona: `e2e/maya.spec.ts`, `e2e/daniel.spec.ts`, `e2e/sarah.spec.ts`. Each `test.step` matches one step in `docs/user-flows.md` and uses its name, e.g. `Maya 3 · Understand`.
- Viewports: Maya and Daniel 1280 × 800; Sarah and Daniel step 8 at 390 × 844.
- Pattern steps (Daniel 8, Sarah 6 and 7) open the matching Storybook story from issue 13 (`Patterns/Edge states`: Quiet hours, Disconnected, Overload).
- Find elements the way a person does: `getByRole` with accessible names, and `getByText` with the exact copy. No CSS selectors or test ids for anything visible.
- Where a step quotes persona data, import the copy from `src/data/*.json` instead of retyping it.
- On failure, attach a screenshot. Add the e2e job to the GitHub Actions build check.

## Acceptance criteria
- [ ] Every Given / When / Then block in `docs/user-flows.md` has a matching `test.step`: Maya 8, Daniel 8, Sarah 7.
- [ ] All three specs pass locally and in CI.
- [ ] They also pass with `reducedMotion: 'reduce'`.
- [ ] No fixed waits: rely on Playwright’s auto-waiting (the 320 ms row collapse included).
- [ ] If a step can’t pass because the app differs from the flow, the PR lists it under **Open questions** instead of changing the test or the copy.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/user-flows.md`, `docs/screens/flows/`, `docs/decisions.md` D34–D36

## Out of scope
Visual regression against the reference screenshots; other browsers.
