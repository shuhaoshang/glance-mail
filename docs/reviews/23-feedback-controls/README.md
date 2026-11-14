# Menus, confirmations, and inline forms

Task 23 / [Issue #55](https://github.com/shuhaoshang/glance-mail/issues/55), based on main at `54b9905` after PR #67.

This PR adds MoveMenu, Toast with ToastProvider/useToast, TextInput, and InlineForm to the design system. The examples use the supplied Maya content and the messages in design-system section 9.7. They demonstrate callbacks without moving emails or building Watchlist or Memory screens.

## References and screenshots

These are new components, so there is no earlier implementation screenshot. The references are [the desktop menu](../../screens/v2/needs-you-move.png), [the confirmation](../../screens/v2/heads-up-moved.png), [the add form](../../screens/v2/watchlist-add.png), and [the phone menu](../../screens/v2/phone-sheet-move.png).

Desktop viewport: 1280 × 800. Phone viewport: 390 × 844. Both themes and reduced motion were emulated in isolated headless Chromium contexts. No computer settings were changed.

| Component or state | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| MoveMenu | [Light](menu-desktop-light.jpg) | [Dark](menu-desktop-dark.jpg) | [Light](menu-phone-light.jpg) | [Dark](menu-phone-dark.jpg) |
| Toast with Undo | [Light](toast-desktop-light.jpg) | [Dark](toast-desktop-dark.jpg) | [Light](toast-phone-light.jpg) | [Dark](toast-phone-dark.jpg) |
| Focused TextInput | [Light](input-desktop-light.jpg) | [Dark](input-desktop-dark.jpg) | [Light](input-phone-light.jpg) | [Dark](input-phone-dark.jpg) |
| InlineForm: filled on desktop, empty on phone | [Light](form-desktop-light.jpg) | [Dark](form-desktop-dark.jpg) | [Light](form-phone-light.jpg) | [Dark](form-phone-dark.jpg) |

The phone Toast also stays above a taller action bar: [light](toast-expanded-phone-light.jpg), [dark](toast-expanded-phone-dark.jpg). These are isolated component previews, not new product screens.

## How to review

- **Composites/MoveMenu:** Default, HeadsUp, and OtherMail show each checked current destination. Hover, Pressed, and CurrentHover demonstrate row states. KeyboardAndDismissal verifies first-enabled focus, arrow keys, Home/End, disabled activation, Escape, outside click, and the callback. InSheet uses the existing native detail sheet.
- **Primitives/Toast:** Default, WithoutUndo, Short, Watchlist, and Memory cover the specified message shapes. Use the replay buttons to replace a confirmation. Focused pauses it; Hovered, CloseHovered, Pressed, and ClosePressed expose the approved control states. Replacement and UndoOnce verify callbacks. InSheet demonstrates placement above a measured action bar, including its changing height.
- **Primitives/TextInput:** Empty, Filled, Focused, HiddenLabel, Memory, and Editing cover placeholder, value, focus, and both naming methods. Focus uses the specified 1.5-pixel inset ring without an additional outline.
- **Composites/InlineForm:** Empty disables Add, Filled enables it, and Edit uses Save without a note. Memory uses the provided instruction placeholder and note. PhoneLongPlaceholder shows the two-row layout with the long instruction placeholder. SubmitAndCancel verifies whitespace-only prevention, Enter, Escape, and focus return through the example consumer.

## Component contracts

MoveMenu receives a controlled open state, current destination, trigger element, optional action-bar element, and close/choose callbacks. It anchors above the trigger, aligns right on desktop, and matches the supplied action bar on the phone. The menu is portaled into the open dialog when applicable. A click outside dismisses the menu and returns focus; it does not activate the outside target. Choosing calls back once after closing. No email state changes inside the component.

Mount one ToastProvider for the application and call useToast from any descendant. showToast accepts a title, optional description, optional Undo callback, and optional focus-return element. A new message replaces the current one and restarts its six-second lifetime. Hover and focus pause the remaining time independently. Replacing a focused message preserves keyboard access even if the new message has no Undo. Dismissal consumes the current message before calling Undo, so repeated activation cannot invoke it twice. The consumer's callback owns restoring data and selection.

For a native phone sheet, pass the open dialog as the provider's container and the actual footer element as actionBar. This keeps the live status and controls in the dialog's top layer and focus scope. A ResizeObserver measures footer changes; the Toast remains 16 above it. On a regular phone page it uses 16 margins plus the safe-area inset. On desktop it uses the specified 24 bottom offset and 416–640 width range.

TextInput requires a label. hideLabel uses that name as aria-label instead of rendering a visible label. InlineForm is controlled through value/onValueChange, calls onSubmit with a nonempty trimmed value, and calls onCancel for Cancel or Escape. Its consumer owns closing and restoring focus. It does not save application data. Below the shared desktop breakpoint, the input fills the first row and the compact submit/Cancel buttons remain start-aligned on a second row, 8 apart. The optional mobile override supports isolated phone examples.

The eye glyph is reused. Move, bulb, pencil, trash, plus, chevron-down, and quote glyphs are added to the existing icon set.

## Validation

- App and Storybook production builds, lint, formatting, data validation, and check:english pass.
- All 60 Playwright checks pass in light/dark with normal/reduced motion. The existing GitHub Actions workflow runs the full suite.
- All 40 new component stories complete at both widths and themes: 160 render/interaction checks.
- Controlled browser time verifies expiration, both pause reasons together, remaining-time resumption, replacement deadlines, and focused replacement. Undo, close, and return focus are checked separately.
- The phone tests verify a 358-wide Toast at x=16, a 16-pixel clearance above both footer heights, and that the Toast remains inside the modal dialog. The phone MoveMenu spans the 390-wide action bar and does not close the sheet when dismissed.
- Tokens and persona files are unchanged. Runtime placement values come from measured element bounds; the six-second timeout is the behavior explicitly specified in section 9.7.

## Review changes

The designer's [review](https://github.com/shuhaoshang/glance-mail/pull/68#issuecomment-6870570387) resolves all three open questions:

- Close uses `--color-on-ink-muted` at rest and `--color-on-ink` on hover and press. Undo keeps `--color-on-ink-link` and gains an underline with `--space-2` offset on hover and press. Both fills remain transparent, with the shared focus outline.
- The phone InlineForm places the input across the first row, then submit and Cancel in their existing order, start-aligned and 8 apart. PhoneLongPlaceholder uses the documented instruction placeholder.
- The reference differences are accepted: the input keeps the documented 48 height, radius 12, and disabled-empty submit rule.
- Sections 9.7 and 9.11 now document these decisions. The input examples use immediate local state so rapid typing remains reliable. Scene checks verify Storybook's success result and interaction errors; InSheet now asserts against the status message itself.

The existing screenshots have been refreshed. New state evidence:

| State | Light | Dark |
| --- | --- | --- |
| Undo hovered | [Light](toast-hovered-light.jpg) | [Dark](toast-hovered-dark.jpg) |
| Close hovered | [Light](toast-close-hovered-light.jpg) | [Dark](toast-close-hovered-dark.jpg) |
| Phone form with long placeholder | [Light](form-long-placeholder-phone-light.jpg) | [Dark](form-long-placeholder-phone-dark.jpg) |

Toast state images capture the bottom 200 pixels of a 1280 × 800 viewport. Before-review examples remain available at the original commit: [phone form](https://github.com/shuhaoshang/glance-mail/blob/0099faeec1283837cdf60b816fd1f5723d54c71e/docs/reviews/23-feedback-controls/form-phone-light.jpg), [light toast](https://github.com/shuhaoshang/glance-mail/blob/0099faeec1283837cdf60b816fd1f5723d54c71e/docs/reviews/23-feedback-controls/toast-desktop-light.jpg), and [dark toast](https://github.com/shuhaoshang/glance-mail/blob/0099faeec1283837cdf60b816fd1f5723d54c71e/docs/reviews/23-feedback-controls/toast-desktop-dark.jpg).

## Open questions

None. The review confirms the Toast control states and phone InlineForm layout, and accepts the documented reference differences.
