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
- **Primitives/Toast:** Default, WithoutUndo, Short, Watchlist, and Memory cover the specified message shapes. Use the replay buttons to replace a confirmation. Focused and Hovered pause it; Replacement and UndoOnce verify callbacks. InSheet demonstrates placement above a measured action bar, including its changing height.
- **Primitives/TextInput:** Empty, Filled, Focused, HiddenLabel, Memory, and Editing cover placeholder, value, focus, and both naming methods. Focus uses the specified 1.5-pixel inset ring without an additional outline.
- **Composites/InlineForm:** Empty disables Add, Filled enables it, and Edit uses Save without a note. Memory uses the provided instruction placeholder and note. SubmitAndCancel verifies whitespace-only prevention, Enter, Escape, and focus return through the example consumer.

## Component contracts

MoveMenu receives a controlled open state, current destination, trigger element, optional action-bar element, and close/choose callbacks. It anchors above the trigger, aligns right on desktop, and matches the supplied action bar on the phone. The menu is portaled into the open dialog when applicable. A click outside dismisses the menu and returns focus; it does not activate the outside target. Choosing calls back once after closing. No email state changes inside the component.

Mount one ToastProvider for the application and call useToast from any descendant. showToast accepts a title, optional description, optional Undo callback, and optional focus-return element. A new message replaces the current one and restarts its six-second lifetime. Hover and focus pause the remaining time independently. Replacing a focused message preserves keyboard access even if the new message has no Undo. Dismissal consumes the current message before calling Undo, so repeated activation cannot invoke it twice. The consumer's callback owns restoring data and selection.

For a native phone sheet, pass the open dialog as the provider's container and the actual footer element as actionBar. This keeps the live status and controls in the dialog's top layer and focus scope. A ResizeObserver measures footer changes; the Toast remains 16 above it. On a regular phone page it uses 16 margins plus the safe-area inset. On desktop it uses the specified 24 bottom offset and 416–640 width range.

TextInput requires a label. hideLabel uses that name as aria-label instead of rendering a visible label. InlineForm is controlled through value/onValueChange, calls onSubmit with a nonempty trimmed value, and calls onCancel for Cancel or Escape. Its consumer owns closing and restoring focus. It does not save application data.

The eye glyph is reused. Move, bulb, pencil, trash, plus, chevron-down, and quote glyphs are added to the existing icon set.

## Validation

- App and Storybook production builds, lint, formatting, data validation, and check:english pass.
- All 56 Playwright checks pass in light/dark with normal/reduced motion. The existing GitHub Actions workflow runs the full suite.
- All 36 new component stories complete at both widths and themes: 144 render/interaction checks.
- Controlled browser time verifies expiration, both pause reasons together, remaining-time resumption, replacement deadlines, and focused replacement. Undo, close, and return focus are checked separately.
- The phone tests verify a 358-wide Toast at x=16, a 16-pixel clearance above both footer heights, and that the Toast remains inside the modal dialog. The phone MoveMenu spans the 390-wide action bar and does not close the sheet when dismissed.
- Tokens and persona files are unchanged. Runtime placement values come from measured element bounds; the six-second timeout is the behavior explicitly specified in section 9.7.

## Open questions

1. **Toast control hover and press:** section 9.7 defines Undo in `--color-on-ink-link` and the close IconButton, but not their states on the inverse surface. Both currently keep their base colors and transparent fills, with the shared keyboard-focus outline. Proposal: Undo uses `--color-on-ink` on hover/press (light `#FFFFFF`, dark `#16151C`), and the close icon uses `--color-on-ink-muted` (white at 72% in light, ink at 64% in dark). Fills would stay transparent. Please confirm before adding these states.
2. **InlineForm on the phone:** the specification defines the inline input/Add/Cancel arrangement but no phone rearrangement. The current preview keeps that row, so the input has less room. Proposal: at the existing phone breakpoint, put the input on a full-width first row and the compact submit/Cancel buttons on a second row with the existing 8 spacing token. Please confirm before adding this layout.
3. **Reference differences:** the prototype add form has a rounder input and a longer example placeholder, and its empty Add button looks active. The implementation follows section 9.11's 48 height, radius 12, shorter placeholder, and the issue's disabled-empty requirement.
