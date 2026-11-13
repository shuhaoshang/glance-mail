# TabBar and HeaderButton

Task 22 / [Issue #54](https://github.com/shuhaoshang/glance-mail/issues/54), based on main at `4eefe7f` after PR #66.

These are new design-system components. There is no previous component rendering to compare; the references are [desktop](../../screens/v2/needs-you.png), [phone](../../screens/v2/phone-needs-you.png), and [dark desktop](../../screens/v2/dark-needs-you.png). The Storybook examples use supplied Maya data and simple content previews to show selection and panel relationships. Application integration belongs to task 26.

## Screenshots

Desktop viewport: 1280 × 600. Phone viewport: 390 × 844. Both themes and reduced motion were emulated in isolated headless Chromium contexts; no computer settings were changed.

| State | Light | Dark |
| --- | --- | --- |
| Desktop: Needs you selected, Watchlist news | [Light](desktop-needs-you-light.jpg) | [Dark](desktop-needs-you-dark.jpg) |
| Desktop: Watchlist selected, on-ink news dot | [Light](desktop-watchlist-light.jpg) | [Dark](desktop-watchlist-dark.jpg) |
| Desktop: keyboard focus next to hover | [Light](desktop-focus-adjacent-hover-light.jpg) | [Dark](desktop-focus-adjacent-hover-dark.jpg) |
| Desktop: Email group only | [Light](desktop-left-group-only-light.jpg) | [Dark](desktop-left-group-only-dark.jpg) |
| Phone: three equal tabs with counts | [Light](phone-needs-you-light.jpg) | [Dark](phone-needs-you-dark.jpg) |
| Phone: Watchlist header button selected | [Light](phone-watchlist-light.jpg) | [Dark](phone-watchlist-dark.jpg) |
| Phone: Memory header button selected | [Light](phone-memory-light.jpg) | [Dark](phone-memory-dark.jpg) |

The phone examples show both the TabBar and HeaderButton components together so their states can be reviewed. They are component previews, not the future Watchlist or Memory screen layout.

## How to review

- Open Primitives/TabBar. NeedsYou, HeadsUp, OtherMail, Watchlist, and Memory show each selection. NewsSelected and NewsUnselected demonstrate the news dot's color and accessible name. NoNews and LeftGroupOnly cover optional content.
- Use Arrow Left/Right, Home, and End within a group. Tab moves to the next group's entry tab, then the selected content panel. Each group has one tab stop, including the group without the current selection; entering that group with Tab does not change selection.
- Hover or hold an unselected tab: the glass-hover token applies. A selected tab keeps its ink fill, count color, and shadow. FocusAdjacentHover shows the shared focus outline above a neighboring tab.
- At 390 wide, only the Email tablist is rendered. All three tabs have equal widths; names and counts remain on one line using the permitted 12/16 type size. Desktop uses 14/20.
- Open Primitives/HeaderButton. Watchlist uses the eye icon and optional news dot; Memory uses the existing star. The icons use the 20-pixel size and brand color. Unselected hover and press use the glass-hover fill and keep the brand icon. Selected and MemorySelected use ink, an on-ink icon, and the selected-tab shadow; SelectedHover and SelectedPressed keep that appearance. Both controls retain a 44-pixel hit area around their 40-pixel visual circle.

## Component contract

TabBar accepts left and optional right arrays of `{ id, label, count, hasNews? }`, plus `selected` and `onSelect`. An optional `mobile` override supports isolated examples; otherwise the shared desktop breakpoint chooses the layout. No tabs or counts are inserted by the component.

Each tab's `id` is the corresponding panel's ID. The button ID is `${id}-tab`; the panel uses `role="tabpanel"` and `aria-labelledby` pointing to that button. The consumer supplies unique IDs and owns the selected value and content. The examples namespace IDs so multiple stories can coexist in the docs page.

HeaderButton accepts an icon, label, selected state, optional news state and controlled-region ID, and a click callback. Its accessible name appends “, new” when appropriate, and `aria-pressed` exposes selection.

## Validation

- App and Storybook production builds, lint, formatting, data validation, and the English-only check pass.
- All 40 Playwright checks pass across light/dark and normal/reduced motion, including the existing three persona flows and the new TabBar/header checks. The existing GitHub Actions workflow runs the same suite.
- All 32 TabBar and HeaderButton stories render and complete their interactions at 1280 and 390 widths in both themes: 128 successful runs.
- Checks cover group names, roving focus, arrow-key wrapping, Home/End, Tab exit, panel IDs and labels, a single selected tab, optional right group, selected/unselected pointer states, news colors and labels, 4-pixel dot offsets and count clearance, header icon size/color and selected shadow, 44-pixel hit targets, equal phone tab widths, single-line labels/counts, and header-button keyboard activation.
- No new token, dependency, application behavior, or live persona-data change. The supplied 12 spacing token provides the specified glass blur distance. An eye glyph is added to the existing icon set.

## Review changes

The designer's [review](https://github.com/shuhaoshang/glance-mail/pull/67#issuecomment-6857854385) resolves both open questions and corrects the specification:

- News dots are 4 from the top and inline end in both components. The selected Watchlist tab now has a 4-pixel gap between the count and dot at 1280 wide.
- HeaderButton uses `--size-icon-large` (20), `--color-brand` when unselected, and `--color-on-ink` when selected. Selection adds `--shadow-tab-selected`.
- Unselected header hover and press use `--color-glass-hover` with a brand icon. Selected hover and press retain the selected appearance.
- Design-system sections 9.2 and 9.3 reflect these decisions. Section 9.1 points to the header exception so the general page-icon rule stays consistent.

All screenshots above have been refreshed. These links preserve the previous rendering for comparison:

| View | Before review | After review |
| --- | --- | --- |
| Selected Watchlist, light | [Before](https://github.com/shuhaoshang/glance-mail/blob/920bad50c0035338a0dd3baf318be188d9d8226f/docs/reviews/22-tab-bar/desktop-watchlist-light.jpg) | [After](desktop-watchlist-light.jpg) |
| Selected Watchlist, dark | [Before](https://github.com/shuhaoshang/glance-mail/blob/920bad50c0035338a0dd3baf318be188d9d8226f/docs/reviews/22-tab-bar/desktop-watchlist-dark.jpg) | [After](desktop-watchlist-dark.jpg) |
| Phone header, light | [Before](https://github.com/shuhaoshang/glance-mail/blob/920bad50c0035338a0dd3baf318be188d9d8226f/docs/reviews/22-tab-bar/phone-needs-you-light.jpg) | [After](phone-needs-you-light.jpg) |
| Phone header, dark | [Before](https://github.com/shuhaoshang/glance-mail/blob/920bad50c0035338a0dd3baf318be188d9d8226f/docs/reviews/22-tab-bar/phone-needs-you-dark.jpg) | [After](phone-needs-you-dark.jpg) |

## Open questions

None. The review confirms the news-dot offsets and HeaderButton styling, including hover and pressed states.
