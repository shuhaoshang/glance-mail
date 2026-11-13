# Handoff 2 · Visual 2.0

The first handoff (`docs/handoff/README.md`, issues 01 to 18) built Glance. This one changes its structure and look: five tabs, a tinted page with white panels, Other mail with the original email, one Move to, Watchlist, Memory, and a theme switch inside the product.

Start with `codex-kickoff.md`.

## What is in this folder

| Path | What it is |
| --- | --- |
| `issues/19` to `issues/32` | One GitHub issue each, in the order to build them |
| `provided/tokens.css` | The new token file. Copy it over `src/design-system/tokens/tokens.css` in issue 20. Do not edit values |
| `provided/data/*.json` | The version 2 persona data. Copy over `src/data/` in issue 24 |
| `provided/types.ts` | The version 2 types that match the data. Copy over `src/data/types.ts` in issue 24, then format |
| `create-issues.sh` | Creates the issues with the GitHub CLI |

Outside this folder, the same package updates the documents (`docs/decisions.md` D47 to D61, `docs/design-system.md` §9, `docs/design-rules.md` §16, `docs/product-brief.md` §23, `docs/user-flows.md` “Visual 2.0”, `docs/data-model.md` “Version 2”) and adds references: `docs/prototype/v2/` (static pages, one per state) and `docs/screens/v2/` (the same states as images).

## Ground rules for this handoff

1. **The documents are the specification.** `docs/design-system.md` §9 has every size, color token, state and string. The prototype pages and screenshots show how it fits together. If they disagree, the document wins; say so under Open questions.
2. **Never copy CSS from `docs/prototype/v2/`.** It was exported from a design tool, uses raw values and has no states. Build with tokens and CSS Modules as always.
3. **The built app wins where this handoff is silent (D60).** The prototype simplifies things the app already does well. Keep as built, and only let the new tokens restyle them: scene cards, SourcePanel with “Open email,” the hint line, GlanceMark and its label, EmailView and its highlighter switch, AskThread, NewMailRow, DoneRow, SnoozeMenu, AccountLabel, the coverage note, the DetailSheet and its gestures, the demo bar (levels, Simulate reply), keyboard and focus behavior, and motion.
4. **Known differences between the prototype pages and what to build:**
   - Scene cards in the prototype are plain fields. Build nothing new: the existing SceneCard stays.
   - The prototype's source panel has no “Open email” link or close button. The built SourcePanel stays.
   - On the phone, the prototype keeps the sheet open on the next email after Done or Snooze. The built rule stays: the sheet closes (D44).
   - The prototype shows a light “Prototype” bar with a demo-user switch. Ignore it; the built demo bar stays.
   - Outline buttons in the prototype hover with a slightly different gray. Use the built outline states.
5. **No new product decisions.** Anything not in the documents goes under Open questions with a concrete proposal (AGENTS.md).
6. **Every PR keeps CI green**: build, lint, format, `check:english`, `check:data`, Storybook tests, and the Playwright flows. When a PR changes what a flow test expects, update that test in the same PR.
7. **Edge states are not part of this handoff.** First brief, disconnected inbox, quiet hours and overload keep their stories and their current section layout. `SectionCard` and `CollapsedGroup` stay in the library for them. Do not redesign them.

## Order

| # | Issue | Label | Depends on |
| --- | --- | --- | --- |
| 19 | Add the Visual 2.0 documents and references | chore | — |
| 20 | Tokens 2.0 and the page background | ds | 19 |
| 21 | Restyle the shared pieces | ds | 20 |
| 22 | TabBar | ds | 20 |
| 23 | Toast, MoveMenu and TextInput | ds | 20 |
| 24 | Data version 2 | feat | 19 |
| 25 | Rows and details for Heads-up and Other mail | ds | 21, 24 |
| 26 | The brief in tabs | feat | 22, 25 |
| 27 | Move to | feat | 23, 26 |
| 28 | Watchlist | feat | 23, 26 |
| 29 | Memory | feat | 28 |
| 30 | Account menu and theme | feat | 26 |
| 31 | Settings and the signed-out page | feat | 30 |
| 32 | Flows, screenshots and cleanup | chore | 27, 29, 31 |

One issue per PR. Issues 21 and 25 may be split into two PRs each if the review would take longer than about ten minutes; say how you split them.

## Definition of done for every issue

The list in `AGENTS.md`, plus:

- Light and dark both checked, on desktop (1280) and phone (390), with screenshots in the PR.
- Compared against the named files in `docs/screens/v2/`.
- No raw values; no new tokens beyond `provided/tokens.css`. If one seems missing, stop and ask.
- American English, no CJK characters, `[Codex]` on the PR title and comments, the `codex` label.

## Later, not now

- Edge states under the tabs.
- Moves that add a line to Memory.
- New step images for `docs/user-flows.md`.
