# Watchlist

Task 28 / [Issue #60](https://github.com/shuhaoshang/glance-mail/issues/60), based on main at `b4b54ee` after PR #72.

Watchlist now has a desktop tab and a phone header shortcut/page. Topics can be added, renamed, and removed for the session, with Toast Undo. News opens the linked email in its current tab, including after a move. Changes reset with the persona and never change the supplied email ranking.

## Screenshots

All 44 images use isolated Chromium contexts with emulated light/dark themes and reduced motion. Desktop is 1280 × 1000; phone is 390 × 844. Full-page captures include content below the viewport. Visible toasts are paused on Undo during capture. No system settings were changed.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya · 8 topics | [Light](maya-desktop-light.jpg) | [Dark](maya-desktop-dark.jpg) | [Light](maya-phone-light.jpg) | [Dark](maya-phone-dark.jpg) |
| Daniel · 5 topics | [Light](daniel-desktop-light.jpg) | [Dark](daniel-desktop-dark.jpg) | [Light](daniel-phone-light.jpg) | [Dark](daniel-phone-dark.jpg) |
| Sarah · 4 topics | [Light](sarah-desktop-light.jpg) | [Dark](sarah-desktop-dark.jpg) | [Light](sarah-phone-light.jpg) | [Dark](sarah-phone-dark.jpg) |
| Add form | [Light](add-form-desktop-light.jpg) | [Dark](add-form-desktop-dark.jpg) | [Light](add-form-phone-light.jpg) | [Dark](add-form-phone-dark.jpg) |
| Added topic and Undo | [Light](added-desktop-light.jpg) | [Dark](added-desktop-dark.jpg) | [Light](added-phone-light.jpg) | [Dark](added-phone-dark.jpg) |
| Rename form | [Light](rename-desktop-light.jpg) | [Dark](rename-desktop-dark.jpg) | [Light](rename-phone-light.jpg) | [Dark](rename-phone-dark.jpg) |
| Saved name and Undo | [Light](renamed-desktop-light.jpg) | [Dark](renamed-desktop-dark.jpg) | [Light](renamed-phone-light.jpg) | [Dark](renamed-phone-dark.jpg) |
| Removed topic and Undo | [Light](removed-desktop-light.jpg) | [Dark](removed-desktop-dark.jpg) | [Light](removed-phone-light.jpg) | [Dark](removed-phone-dark.jpg) |
| Removal undone | [Light](undo-removal-desktop-light.jpg) | [Dark](undo-removal-desktop-dark.jpg) | [Light](undo-removal-phone-light.jpg) | [Dark](undo-removal-phone-dark.jpg) |
| No remaining news dot | [Light](no-news-desktop-light.jpg) | [Dark](no-news-desktop-dark.jpg) | [Light](no-news-phone-light.jpg) | [Dark](no-news-phone-dark.jpg) |
| Empty Watchlist | [Light](empty-desktop-light.jpg) | [Dark](empty-desktop-dark.jpg) | [Light](empty-phone-light.jpg) | [Dark](empty-phone-dark.jpg) |

Compared with [Watchlist](../../screens/v2/watchlist.png), [adding](../../screens/v2/watchlist-add.png), [phone](../../screens/v2/phone-watchlist.png), and [dark](../../screens/v2/dark-watchlist.png). Before this feature, the brief had no Watchlist navigation: [desktop](../26-brief-in-tabs/maya-needs-you-desktop-light.jpg), [phone](../26-brief-in-tabs/maya-needs-you-phone-light.jpg).

The implementation uses the written panel padding and row sizes. It keeps the built TextInput and InlineForm appearance, including the two-row phone form. Memory and the account menu are later tasks, so their prototype controls are not added here.

## How to review

1. Open Patterns/Watchlist → Maya, Daniel, and Sarah. Confirm 8, 5, and 4 topics. Maya has three topics with news. On the phone, the page replaces the greeting and email tabs, and Back to brief restores the email view.
2. Select “2 new” for Fernway renewal or “1 new” for Corvo Retail QBR. They open Needs you and Heads-up respectively, with the target selected; on the phone the sheet opens. A moved target opens in its current tab.
3. Add “Okto renewal.” It appears first with “Nothing yet” and “Nothing new.” Add and Save reject empty or whitespace-only values. Enter submits; Escape and Cancel return focus without saving.
4. Rename or remove a topic, then use Undo. Order, counts, names, and attribution lines restore. Removing the last topic with news removes the tab/header dot; Undo restores it.
5. Open “Based on Watchlist: …” or “Part of Watchlist: …” from a detail. Rename updates the displayed name; removing the topic hides the line.
6. Check the long supplied names at 390. They wrap within the name column and leave space for Rename and Remove.

## Components and session behavior

- WatchRow uses the existing tint-button states for its news pill and IconButton states for Rename/Remove. The visual pill follows the specified padding and keeps the shared 44-pixel hit area.
- WatchlistPanel uses InlineForm for adding and renaming, with one active editor at a time. Focus returns to Add, Rename, or a remaining row after the corresponding action.
- The app owns the editable topic list and Toast Undo. Original persona JSON and ranking stay unchanged; topic ids retain the attribution relationship through renames.
- Watchlist news counts remain the supplied data; opening an email does not invent a read/acknowledgment state. The dot reflects news in the topics that remain.
- Focus restoration runs after the view update so moving Undo and Watchlist Undo do not focus a still-hidden control. The HeaderButton keyboard story keeps its selection in local state so an argument update does not reset its callback spy.
- The new components and their stories are delivered before app integration in the commit sequence, within the single issue/single PR requested for this task.

## Validation

- App and Storybook builds, lint, formatting, data validation, and English checks pass.
- All 144 Playwright checks pass in both themes and motion preferences, with no skipped cases.
- All 118 related Storybook stories pass at 1280 and 390 in both themes: 472 render/interaction cases.
- Checks cover all personas, both news destinations, blank input, add/rename/remove/Undo, focus, empty state, news-dot removal, long names, moved-email navigation, live attribution, level changes, persona reset, and unchanged ranking.
- Existing Move to, Done, Snooze, Ask, and demo flows remain covered.

## Review follow-up

The Watchlist heading still receives focus when the view opens. Its outline is suppressed for that heading alone. The screenshots above show the updated heading, and the interactive controls keep their shared focus rings. Compare the previous [desktop light](https://github.com/shuhaoshang/glance-mail/blob/38778ed0280761f37a69e862767b43c272e60b09/docs/reviews/28-watchlist/maya-desktop-light.jpg) and [phone dark](https://github.com/shuhaoshang/glance-mail/blob/38778ed0280761f37a69e862767b43c272e60b09/docs/reviews/28-watchlist/maya-phone-dark.jpg) captures.

## Open questions

None. The review confirmed the plain-text “N new” state for done or snoozed emails. Section 9.9 records that decision.
