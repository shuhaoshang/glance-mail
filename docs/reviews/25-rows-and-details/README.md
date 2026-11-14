# Heads-up and Other mail components

Task 25 / [Issue #57](https://github.com/shuhaoshang/glance-mail/issues/57), based on main at `50784b1` after PR #69.

The new HeadsUpRow, OtherMailRow, MailList, and DetailPanel variants are demonstrated with the real persona data. The examples exercise selection and callbacks without assembling the tabbed application or implementing moves.

## Screenshots

Desktop viewport: 1280 × 1000. Phone viewport: 390 × 844. Both themes and reduced motion were emulated in isolated Chromium contexts; no computer settings were changed.

| Example | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| Maya Heads-up and source | [Light](heads-up-desktop-light.jpg) | [Dark](heads-up-desktop-dark.jpg) | [Light](heads-up-phone-light.jpg) | [Dark](heads-up-phone-dark.jpg) |
| Maya Other mail promotion | [Light](other-mail-desktop-light.jpg) | [Dark](other-mail-desktop-dark.jpg) | [Light](other-mail-phone-light.jpg) | [Dark](other-mail-phone-dark.jpg) |
| Needs you head and detail | [Light](needs-you-desktop-light.jpg) | [Dark](needs-you-desktop-dark.jpg) | [Light](needs-you-phone-light.jpg) | [Dark](needs-you-phone-dark.jpg) |
| Daniel Car service | [Light](personal-desktop-light.jpg) | [Dark](personal-desktop-dark.jpg) | [Light](personal-phone-light.jpg) | [Dark](personal-phone-dark.jpg) |
| Needs you email rendered in Heads-up | [Light](moved-desktop-light.jpg) | [Dark](moved-desktop-dark.jpg) | [Light](moved-phone-light.jpg) | [Dark](moved-phone-dark.jpg) |

The new row/detail variants have no previous implementation. Compare them with [heads-up](../../screens/v2/heads-up.png), [other-mail](../../screens/v2/other-mail.png), [Daniel](../../screens/v2/daniel-heads-up.png), [phone detail](../../screens/v2/phone-sheet.png), [phone Other mail](../../screens/v2/phone-sheet-other-mail.png), and [dark Other mail](../../screens/v2/dark-other-mail.png). The previous phone Needs you appearance is available in [light](../21-shared-components/detail-phone-light.jpg) and [dark](../21-shared-components/detail-phone-dark.jpg).

### PR #70 review updates

OtherMailRow now has no gap between its sender/time, subject, and reason lines. HeadsUpRow and BriefRow retain their spacing. Compare the refreshed desktop screenshots with the previous [light](https://github.com/shuhaoshang/glance-mail/blob/211b4ded0ef53aefa2b21c166a188d36077a3e98/docs/reviews/25-rows-and-details/other-mail-desktop-light.jpg) and [dark](https://github.com/shuhaoshang/glance-mail/blob/211b4ded0ef53aefa2b21c166a188d36077a3e98/docs/reviews/25-rows-and-details/other-mail-desktop-dark.jpg) versions.

| Review state | Light | Dark |
| --- | --- | --- |
| Phone Other mail list | [Light](other-mail-list-phone-light.jpg) | [Dark](other-mail-list-phone-dark.jpg) |
| Unselected underline tab, hover | [Light](underline-hover-light.jpg) | [Dark](underline-hover-dark.jpg) |
| Unselected underline tab, pressed | [Light](underline-pressed-light.jpg) | [Dark](underline-pressed-dark.jpg) |
| Selected underline tab, hover | [Light](underline-selected-hover-light.jpg) | [Dark](underline-selected-hover-dark.jpg) |
| Selected underline tab, pressed | [Light](underline-selected-pressed-light.jpg) | [Dark](underline-selected-pressed-dark.jpg) |

The new state screenshots use a 390-wide viewport. Unselected hover and press use `--color-text` on transparent fill; selected tabs retain their text, weight, and underline.

## How to review

- Composites/Mail rows and details: MayaHeadsUp, MayaSecond, Brightline, DanielPersonal, MayaOtherMail, Promotion, OriginalEmail, and JudgmentOnly use real data. Select any row. Heads-up rows contain no underlined fact or nested action.
- SourcesAndRead verifies the fixed source, Open email, Brightline's “Why it’s here: Upsell signal,” the read and evidence, Escape focus return, and tab arrow keys.
- MovedMatrix shows the three source kinds in all three destinations. The moved detail examples retain the source kind, include the moved note, and omit the reasoning pill. The matrix documents rendering; actual moves remain task 27.
- MailList/OtherMail shows four Maya rows and “27 more like these.” ZeroRemaining omits that line; Empty and the combined Empty example show the empty tabs and the existing AllDone content.
- HeadsUpRow and OtherMailRow have separate default, selected, hover, pressed, selected hover/press, focus, and keyboard stories.
- SegmentedControl/Underline, UnderlineKeyboard, UnderlineFocus, UnderlineHover, UnderlinePressed, UnderlineSelectedHover, and UnderlineSelectedPressed share the existing roles, roving tab stop, arrows, Home/End, and disabled-tab skipping. Phone details use this appearance. The Needs you deal fields use two phone columns.

## Reuse and scope

DetailPanel accepts a heads-up or other-mail variant in addition to the existing Needs you props. movedTo identifies the destination while preserving the original detail content. The caller supplies the account and, when applicable, a Watchlist name and callback. The examples expose that callback without creating a Watchlist screen.

SourcePanel supports an optional close callback; the permanent Heads-up source has no close control. EmailBody is extracted from EmailView so both email presentations share highlights, wrapping, source tags, and screen-reader kind text. EmailView retains its highlighter switch. Person and AccountLabel supply sender metadata and the Personal label.

MailList supplies the panel, optional Needs you progress head, remaining count, and empty state. Pass the existing AllDone as emptyContent for a completed Needs you tab. KnowRow stays available for the current application and edge-state stories during the task 26 transition.

## Validation

- App and Storybook builds, lint, formatting, data validation, and English checks pass.
- All 80 Playwright checks pass in both themes and both motion preferences. The new checks cover exact sources, Brightline reasoning, tab keyboard behavior, Personal account labeling, conditional legends, remainder text, moved content, empty states, and phone focus return. They also verify gapless OtherMailRow text and real hover/press behavior for underline tabs.
- All 49 new or directly related Storybook stories pass at 1280 and 390 widths in both themes: 196 renders and interaction runs.
- Tokens and persona JSON are unchanged. Existing sheet gestures and focus management remain in DetailSheet.

## Review decisions

Resolved in the [designer's PR #70 review](https://github.com/shuhaoshang/glance-mail/pull/70#issuecomment-6873878144):

- Keep the existing two-column phone deal layout; the scene-card table now states this explicitly. Future specification differences will be listed under Open questions before implementation.
- Underline tab hover and press follow the approved text-only treatment, documented in section 9.8 and demonstrated by four new state stories.
- A Heads-up or Other mail email with no account belongs to the main account, the one not marked `minority`. Section 9.5 and the data model's Version 2 section record this rule. Storybook examples resolve that account; app callers will pass it in later tasks. No data fields were added.
- Keep the conditional highlight legend, Open email, and the source date in Person as approved.

## Open questions

None. The review resolved the previous questions.
