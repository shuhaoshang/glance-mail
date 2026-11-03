# Issues, in order

Each file below is one GitHub issue. Create them in this order (see `../README.md`). Labels: `chore`, `ds` (design system), `feat`.

| # | Title | Label | Depends on |
|---|---|---|---|
| 01 | [Scaffold the app and deploy it to GitHub Pages](issues/01-scaffold.md) | `chore` | — |
| 02 | [Foundations in Storybook: tokens, themes and text styles](issues/02-foundations.md) | `ds` | 01 |
| 03 | [Core primitives: Button, IconButton, SegmentedControl, labels and Person](issues/03-core-primitives.md) | `ds` | 02 |
| 04 | [Fact primitives: FactChip, Field, Highlight and SourcePanel](issues/04-fact-primitives.md) | `ds` | 03 |
| 05 | [List composites: BriefRow, SectionCard, KnowRow, CollapsedGroup, DoneRow, NewMailRow](issues/05-list-composites.md) | `ds` | 04 |
| 06 | [Brief page, desktop and phone, from persona data](issues/06-brief-page.md) | `feat` | 05 |
| 07 | [Scene cards: 8 types and the text fallback](issues/07-scene-cards.md) | `ds` | 04 |
| 08 | [Detail view: scene card, source, Glance’s read and original email](issues/08-detail-view.md) | `feat` | 06, 07 |
| 09 | [Item lifecycle: Done, Snooze, Undo, all done and simulated reply](issues/09-item-lifecycle.md) | `feat` | 08 |
| 10 | [Ask tab: answers only from email, with sources](issues/10-ask.md) | `feat` | 08 |
| 11 | [Demo bar: persona switch and the 1 · 2 · 3 level switch](issues/11-demo-bar.md) | `feat` | 06 |
| 12 | [Set aside view, Show in brief and new mail](issues/12-set-aside-and-new-mail.md) | `feat` | 06 |
| 13 | [Edge-state patterns: first brief, new mail, disconnected inbox, overload, quiet hours](issues/13-edge-states.md) | `ds` | 06 |
| 14 | [Dark theme in the app](issues/14-dark-theme.md) | `feat` | 06 |
| 15 | [Accessibility and polish pass](issues/15-accessibility.md) | `chore` | 09, 10, 11, 12 |
| 16 | [End-to-end tests: the three persona flows (Playwright)](issues/16-e2e-flows.md) | `chore` | 09, 10, 12, 13 |
