# Data version 2

Task 24 / [Issue #56](https://github.com/shuhaoshang/glance-mail/issues/56), based on main at `9d346f6` after PR #68.

The three supplied persona JSON files are copied byte for byte into src/data. The supplied TypeScript model replaces types.ts and is formatted. The additional email-detail, Watchlist, and Memory fields remain data only; the existing Set aside view continues to use the retained setAside collection.

## Visible changes

Level 2 now uses “Heads-up” and the provided “Other mail” line. The new-mail acknowledgement reads “2 new added: 1 here, 1 in Other mail.”

Desktop captures use 1280 × 1000; phone captures use 390 × 844. Screenshots include the full page. Color scheme and reduced motion were emulated in headless Chromium; no computer settings were changed.

| Maya, level 2 | Before | After |
| --- | --- | --- |
| Desktop, light | [Before](before-level-2-maya-desktop-light.jpg) | [After](after-level-2-maya-desktop-light.jpg) |
| Desktop, dark | [Before](before-level-2-maya-desktop-dark.jpg) | [After](after-level-2-maya-desktop-dark.jpg) |
| Phone, light | [Before](before-level-2-maya-phone-light.jpg) | [After](after-level-2-maya-phone-light.jpg) |
| Phone, dark | [Before](before-level-2-maya-phone-dark.jpg) | [After](after-level-2-maya-phone-dark.jpg) |

The same wording is checked for all three personas. Additional desktop captures: Daniel [light](after-level-2-daniel-desktop-light.jpg) / [dark](after-level-2-daniel-desktop-dark.jpg), Sarah [light](after-level-2-sarah-desktop-light.jpg) / [dark](after-level-2-sarah-desktop-dark.jpg).

| New-mail acknowledgement | Light | Dark |
| --- | --- | --- |
| Desktop | [Light](new-mail-desktop-light.jpg) | [Dark](new-mail-desktop-dark.jpg) |
| Phone | [Light](new-mail-phone-light.jpg) | [Dark](new-mail-phone-dark.jpg) |

## Data validation

The existing TypeScript shape check runs first. Once the shape is valid, check:data verifies the Version 2 coverage equation, the Other mail row-count lower bound, watch references, Watchlist target references and conditional presence, exact Heads-up source sentences in the email, judgment evidence in every Other mail row, and identifier uniqueness across the three email collections.

Coverage and the Other mail lower bound exclude pending new rows where the specification says to do so. Reference and uniqueness checks include pending items. The retained setAside rows are not part of the new identifier namespace.

The invalid-copy checks ran in an isolated project outside the repository using an identical copy of the validator and types. All 11 invalid copies were rejected, and the restored valid copies passed. The failing examples and diagnostics are listed in the PR description, as requested; no invalid fixtures are committed.

## Verification

- git diff --no-index reports no difference for each supplied JSON file and its src/data copy.
- Comparing preexisting values found only the expected version change, new-mail text, and renamed level 2 property; other existing copy and ordering are unchanged.
- All 12 initial level 3 captures are byte-identical before and after: Maya, Daniel, and Sarah in both themes at both widths.
- App and Storybook builds, lint, formatting, check:english, and check:data pass.
- The 60 existing Playwright checks pass. Four additional runs of the new level 2 check cover all three personas at desktop and phone widths under both color schemes and motion preferences.
- The affected Demo, Set aside, and NewMailRow stories pass in both themes and widths, including the full persona/level selection interaction and Maya's new-mail/Set aside flow.

## How to review

1. Open Patterns/Demo → Formatted. Switch among Maya, Daniel, and Sarah and confirm “Heads-up” and “Other mail.”
2. Open Patterns/Set aside → Added or run Add to brief in the app. Check the new acknowledgement and the existing counts and order.
3. Review the validator and the negative-check table in the PR. The JSON content comes directly from the supplied files.

## Open questions

The existing phone Demo disclosure closes when a persona change remounts the session, while Patterns/Overview says it stays open until the toggle or Escape closes it. This PR preserves the current application behavior, as task 24 requires, and the updated selection story reopens the live controls after switching personas. Proposal for a separate follow-up: keep the disclosure state outside the persona session so it remains open, matching that documentation. No runtime change is made here.
