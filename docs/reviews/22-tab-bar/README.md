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
- Open Primitives/HeaderButton. Watchlist uses the eye icon and optional news dot; Memory uses the existing star. Selected and MemorySelected use ink. Both controls retain a 44-pixel hit area around their 40-pixel visual circle.

## Component contract

TabBar accepts left and optional right arrays of `{ id, label, count, hasNews? }`, plus `selected` and `onSelect`. An optional `mobile` override supports isolated examples; otherwise the shared desktop breakpoint chooses the layout. No tabs or counts are inserted by the component.

Each tab's `id` is the corresponding panel's ID. The button ID is `${id}-tab`; the panel uses `role="tabpanel"` and `aria-labelledby` pointing to that button. The consumer supplies unique IDs and owns the selected value and content. The examples namespace IDs so multiple stories can coexist in the docs page.

HeaderButton accepts an icon, label, selected state, optional news state and controlled-region ID, and a click callback. Its accessible name appends “, new” when appropriate, and `aria-pressed` exposes selection.

## Validation

- App and Storybook production builds, lint, formatting, data validation, and the English-only check pass.
- All 40 Playwright checks pass across light/dark and normal/reduced motion, including the existing three persona flows and the new TabBar/header checks. The existing GitHub Actions workflow runs the same suite.
- All 30 TabBar and HeaderButton stories render and complete their interactions at 1280 and 390 widths in both themes: 120 successful runs.
- Checks cover group names, roving focus, arrow-key wrapping, Home/End, Tab exit, panel IDs and labels, a single selected tab, optional right group, selected/unselected pointer states, news colors and labels, 44-pixel hit targets, equal phone tab widths, single-line labels/counts, and header-button keyboard activation.
- No new token, dependency, application behavior, or live persona-data change. The supplied 12 spacing token provides the specified glass blur distance. An eye glyph is added to the existing icon set.

## Open questions

1. Section 9.2 defines the HeaderButton default and selected states, but not its hover or pressed treatment. These states currently retain the base appearance; keyboard focus uses the shared outline. Proposal: use `--color-glass-hover` for both unselected hover and press (light `#FFFFFF`, dark `rgba(255, 255, 255, 0.08)`) with `--color-text` icons, and keep selected buttons unchanged. Please confirm before these styles are added.
2. Reference difference: the phone screenshot uses brand-colored header icons, while section 9.2 specifies `--color-text-secondary`. The implementation follows the written specification, with `--color-on-ink` for the selected icon.
