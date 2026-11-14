# Glance design system

**Version:** 1.0 (handoff) · **Owner:** Shuhao Shang (design) · **Tokens:** `src/design-system/tokens/tokens.css`

This document is the build spec for `src/design-system/`. It lists every component, its props and states, and the rules for choosing between them. The visual reference is in `docs/screens/` and the clickable prototypes are in `docs/prototype/`.

Read it together with:

- `docs/design-rules.md`: the rules behind the values (color meaning, the 4 px grid, sourcing, edge states).
- `docs/data-model.md`: the shape of the mock data these components render.

---

## 1. Principles the components enforce

1. **Two kinds of content.** _Facts_ are taken word for word from an email. _Glance's words_ (summaries, judgments, ranking reasons) are always marked with ✦ and never put in quotation marks.
2. **Hue is type, fill is urgency, purple is Glance.**
   - Hue tells the type: yellow = money, pink = time, blue = people.
   - A solid fill means urgent.
   - Purple is reserved for Glance: primary action, selection, sources, AI marks.
3. **Pastels are highlighter ink.** Tints mark words in a source or fill small icon tiles. They never fill a section.
4. **Every fact can show where it came from.** In one gesture, with the exact words highlighted.
5. **One primary button per view.**
6. **Lists are uniform; details are specific.** Every item in a list uses the same row. The detail view swaps in a scene card chosen by the email's structure.
7. **No dead controls.** If something can't act, it is plain text, not a button.

---

## 2. Tokens

All values come from `tokens.css`. The groups are:

| Group  | Examples                                                      | Notes                                                                                                   |
| ------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Color | `--color-surface`, `--color-brand`, `--color-money-ink`       | Semantic names, light and dark values. Dark applies with `prefers-color-scheme` or `data-theme="dark"`. |
| Type   | `--font-size-16`, `--line-height-16`, `--line-height-reading` | Sizes are even; line heights are multiples of 4. Proportional figures (no `tnum`).                      |
| Space  | `--space-2` … `--space-48`                                    | Multiples of 4; 2 is the only half step.                                                                |
| Size   | `--size-touch`, `--size-button`, `--size-dot`                 | Touch targets 44 (40 inside toolbars).                                                                  |
| Radius | `--radius-highlight` … `--radius-pill`                        | 4 · 8 · 12 · 16 · 20 · 24 · 999                                                                         |
| Border | `--border-hairline`, `--border-selected`                      | Exempt from the grid. Selection rings are inset `box-shadow`, so selection never changes size.          |
| Focus | `--focus-ring-width`, `--focus-ring-offset` | Keyboard focus: 2 px width and 2 px offset, independent of spacing. |
| Motion | `--duration-sweep`, `--ease-sweep`                            | Every duration becomes 1 ms under reduced motion.                                                       |
| Layout | `--gutter`, `--column-list`, `--content-max`                  | Desktop (≥ 960 px) picks larger steps: one scale, two densities.                                        |

### Interactive colors

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-brand-hover` | `#4A3FD0` | `#5A4EE0` | Primary button hover fill |
| `--color-brand-pressed` | `#3F35B8` | `#5045CC` | Primary button pressed fill |
| `--color-brand-tint-hover` | `#E3E0FB` | `#322D5E` | Tint button hover fill |
| `--color-brand-tint-pressed` | `#D8D4F8` | `#3B356E` | Tint button pressed fill |
| `--color-sunken-hover` | `#E6E5EC` | `#34333F` | Neutral and icon button hover fill |
| `--color-sunken-pressed` | `#D9D8E0` | `#3B3A47` | Neutral and icon button pressed fill |
| `--color-brand-text-hover` | `#3529B0` | `#CFCBFF` | Text button hover and pressed ink |
| `--color-switch-off-hover` | `var(--color-text-muted)` | `#76748A` | Switch off hover track |
| `--color-switch-off-pressed` | `var(--color-text-secondary)` | `#68667C` | Switch off pressed track |
| `--color-money-field-hover` | `var(--color-money-selected)` | `var(--color-money-selected)` | Money Field hover fill |
| `--color-money-field-pressed` | `var(--color-money-tint)` | `var(--color-money-tint)` | Money Field pressed fill |
| `--color-time-field-hover` | `var(--color-time-selected)` | `var(--color-time-selected)` | Time Field hover fill |
| `--color-time-field-pressed` | `var(--color-time-tint)` | `var(--color-time-tint)` | Time Field pressed fill |
| `--color-people-field-hover` | `var(--color-people-selected)` | `var(--color-people-selected)` | People Field hover fill |
| `--color-people-field-pressed` | `var(--color-people-tint)` | `var(--color-people-tint)` | People Field pressed fill |
| `--color-row-hover` | `var(--color-surface-muted)` | `var(--color-surface-muted)` | BriefRow and CollapsedGroup hover fill |
| `--color-row-pressed` | `var(--color-surface-sunken)` | `var(--color-surface-sunken)` | BriefRow and CollapsedGroup pressed fill |

Field and row aliases are declared once in `:root` and resolve against the active light or dark palette. Switch off-state tokens use light aliases and explicit overrides in both dark blocks to preserve contrast with the white knob.

### Keyboard focus

Every focus outline uses `--focus-ring-width` (2 px), `--focus-ring-offset` (2 px), and `--color-brand`. Spacing tokens do not define focus outlines. The shared `.control:focus-visible` rule sets `position: relative` and `z-index: 1` so the focused control is above neighboring selected or hovered controls. SegmentedControl inherits this shared rule.

### Enter motion

Rows and content that appear (a new BriefRow, a DoneRow, an Ask answer, rows revealed by “Show more”) fade down over `--duration-enter` (240 ms), moving `--space-4`. Like every duration, it becomes 1 ms under reduced motion.

### Other tokens added with the composites and screens

| Token | Value | Use | Issue |
| --- | --- | --- | --- |
| `--size-checkbox` | `24px` | Checkbox box | 18 |
| `--size-switch-track-width` | `36px` | Switch track | 18 |
| `--size-switch-track-height` | `20px` | Switch track | 18 |
| `--size-switch-knob` | `16px` | Switch knob | 18 |
| `--shadow-popover` | Light: `0 8px 24px rgba(22, 21, 28, 0.12)`; dark: `0 8px 24px rgba(0, 0, 0, 0.48)` | SnoozeMenu overlay layer; dark override in both dark blocks | 09 |
| `--size-progress` | `4px` | ProgressBar height | 18 |
| `--content-narrow` | `640px` | Single-column max width from 600 to 959 px | 06 |
| `--size-sheet-top` | `56px` | Gap above the phone sheet | 08 |
| `--size-handle-width` | `36px` | Sheet handle | 08 |
| `--size-handle-height` | `4px` | Sheet handle | 08 |
| `--color-demo-control-hover` | `#36343F` (both themes) | Demo bar control hover | 11 |
| `--color-demo-control-pressed` | `#42404D` (both themes) | Unselected demo control press | 11 |
| `--content-reading` | `784px` | L1/L2 card outer maximum width (720 text plus 32 padding per side on desktop) | 11 |
| `--duration-shimmer` | `1600ms` (no shimmer under reduced motion) | Skeleton shimmer | 13 |

Each issue adds its own tokens to `tokens.css`; this table says where every value comes from.

If a component needs a value that is not a token, **stop and ask in the PR**. Do not add it inline.

---

## 3. Primitives

Each primitive lives in `src/design-system/components/<Name>/` with `Name.tsx`, `Name.module.css` and `Name.stories.tsx`.

### Text styles

Text styles are utility components or CSS classes, not one-off font sizes:

- `Display` (greeting): 28/32 phone, 32/40 desktop
- `Request`: 20/28 phone, 24/32 desktop
- `Title` (item name): 18/24 phone, 20/28 desktop. Always smaller than the request.
- `Section`
- `Body`
- `Reading` (16/28)
- `Meta` (14/20 muted)
- `Chip` (12/16)

### Button

| Prop       | Values                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `variant`  | `primary` (brand fill, one per view) · `tint` (brand tint) · `neutral` (sunken) · `outline` (surface fill, 1 px ring) · `text` (brand text, no fill) |
| `size`     | `default` (48) · `touch` (44, selected by phone layouts for secondary buttons) · `compact` (40, toolbars and tab groups) |
| `icon`     | optional leading or trailing icon (16)                                                                                   |
| `external` | shows the external-link icon (for "Open in Gmail")                                                                       |

**States:** default, hover, focus-visible (`--focus-ring-width` brand outline, `--focus-ring-offset` offset), pressed, disabled.

Hover and pressed use the interactive color tokens above and the 160 ms fast transition. Tint buttons keep `--color-brand-text` in both states; neutral buttons keep `--color-text`. Text buttons stay transparent and use `--color-brand-text-hover` for both hover and pressed.

Disabled primary, tint, and neutral buttons use `--color-surface-sunken` with `--color-text-muted`. Disabled text buttons stay transparent with `--color-text-muted`. Any icons use `--color-icon-muted`. Disabled links follow the same variant rules. Hover and pressed do not add a ring; the outline marks keyboard focus.

**Outline** (issue 18): `--color-surface` fill, a `--border-hairline` inset ring in `--color-border-strong`, `--color-text`, 14/20 medium, `compact` height 40. Hover fills with `--color-sunken-hover`, pressed with `--color-sunken-pressed`; the ring stays. Used for Snooze options, Ask suggestions and “Move to Set aside”. It defaults to `compact` when `size` is omitted. Disabled follows the filled-button rule.

### IconButton

44 × 44 hit area (40 compact) around a 16–20 icon. `aria-label` is required.

The background is transparent at rest. Hover shows a `--color-sunken-hover` circle, and pressed uses `--color-sunken-pressed`. Disabled stays transparent with `--color-icon-muted`. The focus-visible outline follows Button.

### SegmentedControl

Used for the detail tabs (Details · Original email · Ask) and the demo-only level switch.

- Sunken track with 4 px padding.
- Unselected segments use `--color-sunken-hover` on hover and `--color-sunken-pressed` on press, with `--color-text-secondary` text in both states.
- The selected segment keeps its `--color-surface` fill, `--color-text` text, and `--shadow-tab` on hover and press; its appearance does not change.
- Only `:focus-visible` adds an outline. The focused segment inherits the shared focus layering rule so neighboring hover fills cannot cover its outline.
- Roles: `tablist` / `tab`, with arrow-key navigation.

### FactChip

For list rows only.

| Prop     | Values                      |
| -------- | --------------------------- |
| `kind`   | `money` · `time` · `people` |
| `urgent` | boolean                     |
| `label`  | string                      |

Without `urgent`, the chip is a sunken pill with an 8 px dot in the type color. With `urgent`, it is solid `--color-urgent` with white text and a white dot. Padding is 4 12 4 8 (the dot side is 4 tighter).

### AccountLabel

An outlined pill (surface fill, 1 px inset `--color-border-strong`). It appears only on items from the **less common** inbox.

### Badge

`New`: a brand-tint pill.

### GlanceMark

The ✦ glyph, plus the optional label “Glance’s summary · not the sender’s words”. Use it anywhere Glance wrote the words.

### ReasonPill

The ✦ judgment trigger: an outlined brand pill with the ✦ glyph and the label. KnowRow uses the small size; the ReasonPanel trigger uses the default size.

- Two sizes:
  - `small` (KnowRow): 12/16 semibold, padding 4 12 4 8, visible height 24. The hit area extends to at least 44 × 44 without changing the visible size or the layout.
  - `default` (the “Glance’s read” trigger in the detail view): 14/20 semibold, padding 8 16 8 12, height 40.
- Both: `--color-brand-text` on `--color-surface`, with a `--border-selected` inset ring in `--color-brand`.
- On phone, wrapped labels align to the start, with the ✦ aligned to the first line.
- Hover fills with `--color-brand-tint`; pressed with `--color-brand-tint-hover`. While expanded (`aria-expanded="true"`) it keeps `--color-brand-tint`.

Both ReasonPill sizes expose a 44 × 44 button target while reserving only the visible pill height in the row layout. The visible sizes remain 24 and 40.

### Field

A value from the email. This is the building block of every scene card.

| Prop       | Values                                                      |
| ---------- | ----------------------------------------------------------- |
| `label`    | optional small label above (Meta style)                     |
| `value`    | string                                                      |
| `size`     | `small` (16/24) · `default` (20/28) · `large` (32/40, bold) |
| `fact`     | optional fact id; when present the field is a button        |
| `selected` | boolean                                                     |

**With a fact:**

- The value has a 2 px dotted underline in the fact's type color, offset 6.
- When selected, the value is inked with that type's `-ink` color, and the SourcePanel opens below the card.
- `aria-label` reads as “Contract: $48,000/yr. Show where the email says so”.

In sentence content such as KnowRow, `inline` keeps the surrounding type size, line height, and weight while preserving the Field interaction and accessibility behavior.

**Without a fact:** the field is plain text. It is not focusable, and it has no underline.

The enclosing item resolves the fact ID and supplies its `kind` plus `onSelect(factId)`. `selected` is controlled by that item, and `sourcePanelId` links the trigger to its source region. Enter or Space opens the source; closing the connected example restores focus to the field.

Keyboard focus uses the same 2 px brand outline and 2 px offset as the other primitives. Unselected sourced fields use their type's `-field-hover` and `-field-pressed` aliases, with the 160 ms fast transition. Their text and dotted underline stay unchanged. Selected ink takes precedence over hover and pressed; unsourced fields have neither interaction state.


### Highlight

Inline ink on words in a source or an email.

| Prop       | Values                                   |
| ---------- | ---------------------------------------- |
| `kind`     | `money` · `time` · `people` · `judgment` |
| `selected` | adds a 1.5 px ring in the type color    |
| `animate`  | the sweep (see Motion)                   |

Text that wraps keeps the ink on every line (`box-decoration-break: clone`). Short facts do not wrap.

`wrap` defaults to false for short facts; set it for source passages that can span lines. The ink and the inset `--border-selected` ring are cloned on every line. `animate` sweeps the ink and, when selected, reveals the ring afterward. Reduced motion shows the completed ink and ring immediately.


### SourcePanel

- **Header:** “Source · {sender} · {date}”, an “Open email” text button, and a close IconButton.
- **Body:** the sentence in `Reading` style, with the fact highlighted.
- **Narrow header:** actions stay together on one line at the top right; the sender and date wrap within the remaining left column.
- **Alignment:** the first line of the sender and date shares a baseline with “Open email” (`align-items: first baseline`), on one line or several (issue 18).
- **Entrance:**
  1. The panel fades in (200 ms).
  2. The ink sweeps across the words left to right (480 ms).
  3. The ring appears (200 ms).

The panel accepts `from`, `when`, `source` (`pre`, `hl`, `post`), and `kind`. The caller handles `onOpenEmail` and `onClose`; the primitive does not choose an email app or a mobile sheet layout. `animate` defaults to true. Remount the panel to replay the entrance; the Storybook examples provide **Replay source reveal**. With reduced motion, all three stages appear immediately.


### ReasonPanel (“Glance’s read”)

- **Trigger:** an outlined brand pill reading “✦ Glance’s read: Ranked 1st · Renewal risk · Why?”.
- **Panel:**
  - Title: “Glance’s reasoning · not stated in the email”.
  - One line per judgment.
  - Each judgment with evidence shows a nested source, using `judgment` ink.
  - Last, under a divider: “Not for you? Glance will rank emails like this lower.” with an outline Button “Move to Set aside” (tray-arrow icon). See design-rules §8.

### DateTile

A 56 × 56 tile: month on top (12/16, `--color-time-text`), day below (24/28 bold). The supplied calendar reference uses `--color-surface`, `--radius-panel-small`, and a `--border-hairline` inset ring in `--color-border-card`.

### Person

A 24 avatar (people tint, initial), followed by name and role.

### Checkbox

- Box: `--size-checkbox` (24), radius 8, `--border-selected` ring in `--color-icon-muted`.
- Checked: `--color-brand` fill with an `--color-on-brand` check.
- Hit area: 44 (`--size-touch`). Ticking is the main action in a checklist, so it gets the full touch target; the box stays 24.
- Hover: unchecked fills with `--color-sunken-hover`; checked uses `--color-brand-hover`. Pressed: `--color-sunken-pressed` or `--color-brand-pressed`. No extra outline; the outline is for keyboard focus only.
- Disabled: `--color-surface-sunken` box, `--color-icon-muted` ring and check, and `--color-text-muted` label. Native disabled behavior prevents toggling; inline Fields retain their own styling and remain operable.
- Role: `checkbox`. `checked` and `onCheckedChange` are controlled by the caller. The `label` slot accepts inline Fields; their clicks do not toggle the checkbox. For a rich label, `aria-label` can supply its plain spoken text. The caller sets `completed` when the checklist is complete; its text uses `--color-text-muted` with a strike-through. Inline Fields retain `--color-text`, their own underline, and no strike-through, and remain operable.

### Switch

- Track: `--size-switch-track-width` × `--size-switch-track-height` (36 × 20). Knob: `--size-switch-knob` (16), `--color-on-brand`.
- On: `--color-brand`. Off: `--color-icon-muted`.
- Hover: on uses `--color-brand-hover`; off uses `--color-switch-off-hover`. Pressed: on uses `--color-brand-pressed`; off uses `--color-switch-off-pressed`. The off-track tokens keep the white knob contrast approximately 4.5:1 on hover and 5.6:1 on press in dark theme.
- The knob slides over `--duration-fast`. Only `:focus-visible` draws an outline.
- Disabled: `--color-surface-sunken` track, `--color-icon-muted` knob, and `--color-text-muted` label. The control cannot toggle and hover/press do not change its colors.
- Hit area: 44, including the visible label.
- Role: `switch`, with a native checkbox input and a visible text label. `checked` and `onCheckedChange` are controlled by the caller.

### ProgressBar

`--size-progress` (4) tall, `--color-brand` fill on a `--color-brand-tint` track, radius pill. The fill width animates over `--duration-reveal`. Used for “1 of 4 done” and the first-brief reading progress. It is decorative: the text next to it carries the value, and the text is the live region.

### Skeleton

A `--color-surface-sunken` bar with a `--color-surface-muted` shimmer over `--duration-shimmer` (1.6 s). With reduced motion it is a static bar. It only shows the shape of content that is about to arrive. Never put placeholder text in it.

### Icons

Inline SVG, 24 viewBox, stroke 2, round caps and joins. The set:

- star ✦ (filled)
- clock
- tag
- people
- chart
- package
- mail
- chevron
- close
- message
- check
- external
- arrow
- moon
- lock
- link-off

---

## 4. Composites

### BriefRow (list item)

The same row for every item, whatever its type.

- Rank number (14/24, muted; brand when selected)
- Name (16/24 semibold)
- Optional AccountLabel and Badge
- The request: a quote, or a ✦ summary. Up to two lines on desktop and phone, then an ellipsis.
- Up to two FactChips, taken from the item's first two facts. An urgent fact always comes first.

**States:**

- Default: no fill.
- Hover: `--color-row-hover`. Pressed: `--color-row-pressed`. No outline; the outline is for keyboard focus only.
- Selected: `--color-brand-tint` fill and `aria-pressed`; the rank turns brand. Selected and hovered: `--color-brand-tint-hover`. Selected and pressed: `--color-brand-tint-pressed`.
- Leaving: collapses over `--duration-collapse` (320 ms).
- New: shows the `New` Badge and enters with the enter motion (§2).
- Revealed rows use the same button and phone chevron, accept list fields without detail data, and can enter without showing the `New` Badge.

On phone, adjacent BriefRows have a `--border-hairline` divider in `--color-border` that starts at the content edge, after the rank and gap. Desktop BriefRows have no dividers between them.

### SectionCard

A white card that holds rows: `Needs you`, `Good to know`. The header shows the title, a count, and an optional right slot (progress, “Most urgent first”, “From Gmail only”). The slot accepts any content.

At most one panel is open in a SectionCard: a fact source or a judgment. Opening one closes the other.

### KnowRow (Good to know)

- A 32 icon tile (type tint, type-text stroke).
- Bold title, then text. One value in the text (`fact.value`) is a Field-style link: dotted underline in its type color, inked when open.
- Selecting it opens a SourcePanel inline below the row (`Source · from · when`, the sentence with the words highlighted in the type’s ink). Only one panel is open at a time.
- Optional AccountLabel.
- Optional ReasonPill (§3). Opening it shows the judgment's ✦ read and a SourcePanel in `judgment` ink, inline below the row. The full ReasonPanel is used in the detail view only.
- Rows the user moved here show “Moved by you” and have no fact (they are whole emails, not extracted facts).

### CollapsedGroup (Set aside)

A card button: “31 set aside” plus a breakdown (“18 newsletters · 9 CC’d · 4 promotions”) and a chevron. It is selected while the Set aside view is open. It uses the same hover, pressed and selected fills as BriefRow. When selected, the category breakdown uses `--color-text-secondary` in the resting, hovered, and pressed states to preserve text contrast.

The label defaults to “set aside” and can be “good to know.” An optional summary replaces the count breakdown. In the edge-state stories the summary rows retain the chevron and log an open action.

`CollapsedGroup` can also render as a static card without a chevron, interactive states, or a tab stop.

### SetAsideList

Groups with a title and a count. Each row has a sender or subject, a subject line, and a “Show in brief” text button. A kept row shows “✓ In Good to know · Undo”. Below the rows: “+N more” as plain text, only when more exist.

When the user has moved items out of Needs you, the first group is **Moved by you**: each row shows the item name and its request, with a “Back to Needs you” text button.

On desktop the list opens in the detail area. On phone it opens in the same sheet as the detail view, titled “Set aside”, with the same motion and ways to close.

### DoneRow

A filled `--color-brand` circle with an `--color-on-brand` check at `--size-icon` (a muted clock for snoozed items, a muted tray-arrow for items moved to Set aside), then “**Name** · what happened”. Undo is optional: only items done during the session receive `onUndo` and show the Undo text button. Rows from `doneBefore` have no restore data and no Undo. Done rows appear with the enter motion (§2). Rows with Undo have a minimum height of `--size-touch`; Undo has its own 44 px target within the row, so adjacent targets never overlap. Use a 12 px gap, with padding 8 4 8 12 on desktop and 8 8 8 16 on phone, from the references.

### NewMailRow

The first row of Needs you when new mail has arrived: “● 2 new since 8:00 AM · Add to brief”. The dot is `--color-brand`. The brief never reshuffles on its own.

### Notice

A neutral card with an icon tile, a title and a body. It may hold one primary Button. It is used for a disconnected inbox.

### DetailPanel (desktop) / DetailSheet (phone)

- **Desktop card:** uses `--color-surface`, `--radius-card`, `--space-24` top padding and `--space-32` side/bottom padding. It contains the position, tabs, Title, Person and minority AccountLabel, then the request with its sender attribution or Glance summary label. Details and Original email share this card. Selection is displayed only while this panel or its phone sheet is visible.
- **Top row:** position (“Needs you · 1 of 3”) and the SegmentedControl.
- **Then:** Title, Person and AccountLabel, the request (with GlanceMark when it is a summary), “From the email · select an underlined value”, the SceneCard, the SourcePanel, the ReasonPanel trigger (ReasonPill, default size).
- **Bottom bar:**
  - Primary “Open in {app}”, followed by Ask (tint).
  - Snooze and Done (neutral), aligned right on desktop.
  - On phone, the primary button is full width on its own row. Secondary buttons share the full width equally on the second row; if only one is present, it fills that row.
  - **Checklist complete** (every step ticked): “Mark done” is the primary; “Open in {app}” becomes neutral; Snooze is not shown. On desktop Mark done stays on the right; on phone it takes the full-width row, with Open and Ask below.
- **“Open in {app}”** is an external link that opens the app's web inbox in a new tab (`https://mail.google.com/`, `https://outlook.office.com/mail/`, `https://mail.yahoo.com/`). The demo has no real message to link to, so it opens the inbox; it never points to `#` (D45).
- **Sheet (phone):**
  - Top `--size-sheet-top` (56), radius 24, a `--size-handle-width` × `--size-handle-height` (36 × 4) handle, scrim `--color-scrim`.
  - Opens by sliding up over `--duration-collapse` (320 ms) with `--ease-standard` while the scrim fades in over `--duration-reveal`; closes in reverse. With reduced motion it appears and disappears at once.
  - Closes with the close button, a tap on the scrim, Escape, or dragging the handle down. The handle is not decorative (D44).
  - While dragging the handle, the sheet follows the finger. On release, it closes after moving at least 25% of its height or with downward release velocity greater than 0.5 px/ms. Otherwise it returns over `--duration-fast`. DetailSheet names these thresholds `DISMISS_DISTANCE_RATIO = 0.25` and `DISMISS_VELOCITY_PX_PER_MS = 0.5`. With reduced motion, dragging still follows the finger and the return is instant.
  - It is a modal dialog (`role="dialog"`, `aria-modal="true"`): focus moves into the sheet, stays there while it is open, and returns to the row that opened it.
- **Desktop panel** is part of the page, not a dialog: focus stays where the user put it.
- **After an action (phone):** Done, Mark done, a Snooze option, or Move to Set aside closes the sheet and returns to the brief, where the DoneRow shows the result. The next item becomes selected but the sheet does not reopen. On desktop the panel shows the next item (D44).

### EmailView

- Subject (20/28) and meta.
- A legend with a highlighter Switch, showing only the ink types that appear in the current email. Keep the order Money · Time · People · Glance’s read, omitting absent types. Maya’s first email shows four; Sarah’s museum email shows three because it has no judgment ink. Filtering depends on the email content, so switching the highlighter off does not remove the legend.
- The body in `Reading` style, with every fact Glance used highlighted by type. A type label appears on hover (as a title) and is read by screen readers. Highlights are not focusable, since they don’t act.
- Toggling the switch draws the ink in or wipes it out (360 ms).

### AskThread

- The user's question is a sunken bubble on the right.
- A **found** answer shows the ✦ Glance label, the answer, and a nested source (judgment ink).
- A **not found** answer shows a box with a `--border-hairline` dashed `--color-border-strong` outline, titled “Not in your email”.
- Suggestions use the `outline` Button.
- Asked questions are stored per item for the whole demo session. They survive tab changes, item switches, and closing/reopening the phone sheet. Changing persona or reloading the page resets the history.
- Choosing a suggestion moves focus to its answer because the suggestion disappears. The thread is not a live region, so screen readers announce the focused answer once.
- New questions and answers appear with the enter motion (§2).
- **In the demo there is no input.** Answers are prepared in advance, so a dashed note replaces it: “**Demo:** answers are prepared in advance, so pick a question above. In the product you type your own.” When every question has been asked: “**Demo:** that’s every prepared question for this item.” An input that never answers would be a dead control (D39).
- In the product, the input row has a tint send button. It is not the primary, because the view already has one.

### SnoozeMenu

A panel with `--color-surface` fill, a `--border-hairline` inset ring in `--color-border-strong`, and `--shadow-popover`. It contains three options (`outline` Buttons) and the note “It comes back to Needs you at that time.” It opens directly above the action bar, in the desktop panel and in the phone sheet, and pushes nothing else around. Choosing an option collapses the row like Done; Escape or Snooze again closes the menu.

---

## 5. Scene cards

A scene card holds **only facts from the email**, laid out by the email's structure. Judgments never go in the card.

**Container:**

- `--color-surface-muted`, radius 16, padding 16 20 20.
- Header: a Meta-style label on the left (“Renewal”, “Decision”…), with an urgent FactChip on the right when the item is urgent.

| Type        | Use when the email…                                   | Layout                                                                                     | Examples                                           |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `deal`      | is about an account with a value, a date and a status | three Fields in a row (default size)                                                       | Maya · Fernway renewal; Halden new lead            |
| `decision`  | offers named options and asks you to choose           | two option tiles (key badge, title, small Field); one per row in the phone sheet                                           | Daniel · Checkout redesign                         |
| `approval`  | asks you to approve an amount                         | large amount Field, then small Fields (for, requested by, deadline), then an optional note | Daniel · Expense report                            |
| `payment`   | is a bill or fee                                      | large amount Field, then due and payee                                                     | Sarah · City Water                                 |
| `mismatch`  | contains two numbers that should agree and don't      | two large Fields with a ≠ in `--color-urgent` between them, then the deadline                            | Maya · Okto invoice                                |
| `event`     | sets one date and time                                | DateTile, then a time Field, a title and an instruction                                    | Sarah · Riverside appointment                      |
| `range`     | spans dates                                           | two DateTiles with an arrow, then the dates Field                                          | Daniel · Lea’s time off                            |
| `checklist` | asks for more than one step                           | Checkbox steps (inline Fields allowed), a divider, then due and context Fields             | Sarah · Lincoln trip slip                          |
| `text`      | has no stable structure                               | no card: an underlined list of the facts                                                   | Maya · Brightline question; Daniel · Riya feedback |

**Selection rules:**

1. The type comes from the data (`item.scene.type`). Components never infer it.
2. If the data has no scene or its type is unknown, render `text`. Knowing when _not_ to use a component is part of the system.
3. Checklist ticks are local progress. They do not mark the item done; only Done or an auto-detected reply does.
   - When every step is ticked: steps are struck through (inline fact values stay readable and tappable), the note `scene.doneNote` appears under the card, and the action bar swaps (see DetailPanel).
4. New scene types need a design-system PR first, with a story for each state.

**States for every scene card:**

- Default.
- One field selected (inked, SourcePanel open).
- Urgent header.
- Long values (wrap without breaking the grid).
- Dark theme.

---

## 6. Patterns

| Pattern            | What it is                                                                                                                                                                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brief layout       | **Phone:** coverage line, then Needs you, Good to know and Set aside, with a detail sheet. **600–959:** the phone layout in one column, at most `--content-narrow` (640) wide and centered. **Desktop (≥ 960):** list column 416 on the left and the DetailPanel on the right, with a 32 gap.                                                                                                               |
| Coverage line      | “38 emails overnight, all in Outlook.” Per-account rules sit under it (“Quiet hours: work email hides after 7:00 PM”).                                                                                                                                                                                      |
| Item lifecycle     | **Done** (manual or reply detected), **snoozed** (comes back at a time), **leaving** (collapse), then a done row with Undo. When nothing is left: “Nothing else needs you right now” if any snoozed items will come back later; otherwise “Nothing else needs you today”.                                                                                                                           |
| New mail           | NewMailRow. Adding it puts new items at the end of the ranking and adds the rest to Set aside.                                                                                                                                                                                                              |
| Show in brief      | A Set aside row moves to Good to know, marked “Moved by you”; the counts update; it can be undone.                                                                                                                                                                                                          |
| First brief        | Connected inboxes with checks, reading progress (“312 of 480 emails”), a skeleton of the brief, and “Read-only” reassurance. “Notify me when it’s ready” calls `onNotify` and is replaced by a check icon and “Glance will notify you when it’s ready.” The reading view stays visible. Notification delivery remains open in design rules §15.                                                                                                                                                                                |
| Disconnected inbox | Say what is missing in three places: the coverage line, a Notice with Reconnect (the one primary), and the section header (“From Gmail only”).                                                                                                                                                              |
| Quiet hours        | Phone, evening: the greeting changes (“Good evening, Daniel”), the coverage line says which inbox is shown (“Personal inbox only.”), a moon label says until when, and a calm card says what is waiting with “Show work email anyway” (text button). Good to know and Set aside show only allowed accounts. |
| Overload           | Needs you shows what fits one screen (phone: top 4), then “Show 8 more, ranked the same way”; the revealed rows enter with the enter motion and the button is removed. Good to know and Set aside collapse into rows.                                                                                                                                                                |
| L1 / L2 / L3       | **Demo only.** The same facts as a paragraph, as formatted text, and as components.                                                                                                                                                                                                                         |
| Demo bar           | **Demo only.** Dark bar in both themes, built from `--color-demo-*` tokens: persona switch, level switch, theme switch (System · Light · Dark), “Simulate reply to {sender}”. Unselected controls hover with `--color-demo-control-hover` and press with `--color-demo-control-pressed`; selected controls retain the demo-text fill and demo-bg text. On phone, a “Demo” button opens the same controls in a panel that drops down under the bar (not the product's sheet). Never styled like the product.                                                                                                                                                                                          |

On desktop, the “Demo controls” caption has its own column. The persona, level, and theme groups and the reply simulation control wrap in order in the remaining column, with each row aligned to the start. The L1 and L2 cards have a `--content-reading` outer maximum width.

Below 600 px, visible persona labels are “Maya”, “Daniel”, and “Sarah”; level labels are “1 Plain”, “2 Formatted”, and “3 Glance”. From 600 px upward, the full labels remain visible. Accessible button names always retain the full persona/role and level labels.

The narrow demo panel opens with `--duration-enter`, moving downward by `--space-4` with `--ease-standard`. Reduced motion shows the final state immediately. Closing uses the existing toggle or Escape.

---

## 7. Accessibility checklist (part of done)

Every control has a hit area of at least 44 × 44. A control that looks smaller extends its hit area invisibly (D46); its look, line height and focus ring don't change.

Escape closes an open source or reasoning panel before the surrounding detail sheet and returns focus to its trigger.

- Contrast:
  - Text is AA in both themes (checked: muted text ≥ 4.97:1, white on brand ≥ 4.98:1).
  - Non-text elements (chevrons, switch off) are ≥ 3:1.
- Every interactive element is keyboard reachable and shows `:focus-visible`.
- Sources open by click or Enter, never only on hover.
- Screen-reader labels:
  - Fields read label, value and “Show where the email says so”.
  - FactChips read type and value through visually hidden type text plus the visible value; static chip spans do not use `aria-label`.
  - Urgent chips include visually hidden text with the word “urgent”.
- Live regions:
  - The progress line (“2 of 5 done”) is announced when it changes.
  - The “2 new” row is announced when it appears.
- Reduced motion turns off the sweep, collapse and fade.

---

## 8. Storybook structure

```
Introduction        What Glance is, how the system is organized, links to the app, prototypes and docs
Foundations/        Colors (light and dark), Type, Spacing, Radius, Motion
Primitives/         Button, IconButton, SegmentedControl, FactChip, AccountLabel, Badge, GlanceMark, ReasonPill,
                    Field, Highlight, SourcePanel, ReasonPanel, DateTile, Person, Checkbox, Switch,
                    ProgressBar, Skeleton, Icons
Composites/         BriefRow, SectionCard, KnowRow, CollapsedGroup, SetAsideList, DoneRow, NewMailRow,
                    Notice, DetailPanel, DetailSheet, EmailView, AskThread, SnoozeMenu
Scene cards/        Deal, Decision, Approval, Payment, Mismatch, Event, Range, Checklist, TextFallback
Patterns/           Brief (desktop, phone), Edge states, Levels (L1/L2/L3)
```

Every story has a theme toggle (light and dark) and uses the persona data from `src/data/` where it can.

Storybook is also the system's documentation site (D41): it carries the Glance theme, opens on Introduction, has a docs page at the top of each category, and an autodocs page for every component. See issue 17.

---

## 9. Visual 2.0

This chapter describes what changed in the Visual 2.0 round (decisions D47 to D61). **Where it disagrees with an earlier section, this chapter wins.** Anything it does not mention stays as specified above and as built, and only picks up the new token values (D60).

Reference: `docs/prototype/v2/` (static pages, one per state) and `docs/screens/v2/` (the same states as images). They show structure and look. Take values from this chapter and from `tokens.css`, never from the exported CSS.

### 9.1 Tokens

`tokens.css` is provided by design (`docs/handoff/v2/provided/tokens.css`). Changed values and new tokens:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-bg` (changed) | `#E9E8F0` | `#0F0F14` | Page |
| `--color-glow-strong`, `--color-glow-soft` (new) | `#D9D3FB`, `#E2DEF9` | brand at 28% and 16% | The two page glows |
| `--background-page` (new) | two radial glows over `--color-bg` | same | The page background, as one value |
| `--color-glass`, `--color-glass-edge`, `--color-glass-hover` (new) | white 64%, `#FFFFFF`, `#FFFFFF` | white 6%, 6%, 8% | Tab groups and phone header buttons, which sit on the page |
| `--color-ink`, `--color-on-ink`, `--color-on-ink-muted`, `--color-on-ink-link` (new) | `#16151C`, `#FFFFFF`, white 72%, `#EEECFD` | `#F2F1F7`, `#16151C`, ink 64%, `#4A3FD0` | Selected tab, selected segment, toast |
| `--color-brand-stroke` (new) | `#CBC6F8` | `#B0AAFF` at 40% | Selected row ring, ReasonPill ring |
| `--color-row-selected` (new) | `#FFFFFF` | `#24222F` | Selected row fill |
| `--color-row-hover` (changed) | `#F4F4F7` | `#22222B` | Row hover inside a panel |
| `--color-text-muted` (changed) | `#62606D` | `#A09EAD` | 5:1 on the new page |
| `--color-time` and its family (changed) | amber: `#CF6F06`, text `#8F4A07`, tint `#FDEBD3`, ink `#FBDDB5`, selected `#FEF4E6` | `#F59E0B`, `#F7C268`, `#3A2A0E`, `#5A4012`, `#2E220C` | Dates (D50) |
| `--color-danger-text` (new) | `#C2255C` | `#FF8FB3` | Destructive text buttons in Settings |
| `--shadow-panel` (new) | two soft layers | a 1 px inner edge and a deep shadow | Every panel on the page |
| `--shadow-row-selected`, `--shadow-tab-selected` (new) | see `tokens.css` | see `tokens.css` | Selected row, selected tab |
| `--radius-card` (changed) | 28 | 28 | Panels on the page (was 20) |
| `--radius-panel` (changed) | 20 | 20 | Inside panels: rows, scene card, reasoning, menus (was 16) |
| `--radius-sheet` (changed) | 28 | 28 | Phone sheet (was 24) |
| `--font-size-40` / `--line-height-40` (new) | 40 / 48 | same | Desktop greeting |
| `--gap-column` (changed) | 12 | 12 | Between the list panel and the detail panel (was 32) |
| `--size-menu`, `--size-toast-min` (new) | 288, 416 | same | Menus; desktop toast |

Rules that follow from the tokens:

- **Three layers.** The page (`--background-page`), panels on the page (`--color-surface`, `--radius-card`, `--shadow-panel`, no border), and blocks inside panels (`--color-surface-muted`, `--radius-panel`, no shadow). Never put a panel inside a panel.
- **Glass is only for things that sit directly on the page**: tab groups and the phone header buttons. `--color-glass` fill, a `--border-hairline` inset ring in `--color-glass-edge`, `backdrop-filter: blur(12px)`.
- **Ink marks what is selected**; brand marks what Glance wrote and the one primary button.
- `--color-icon-muted` is for icons on surfaces. On the page, icons use `--color-text-secondary`, except the header shortcuts specified in 9.2.
- `--shadow-tab` and `--color-brand-tint` as a row fill are no longer used by any component.

### 9.2 Page structure

Desktop, top to bottom inside `--content-max` (1120), page padding 32 top, 80 sides, 96 bottom:

1. **Header:** the Glance mark, and the avatar button on the right (opens the account menu, 9.12).
2. **Greeting block**, 24 below the header: date (14/20, secondary), greeting (`--font-size-40`/`--line-height-40`, medium, `--letter-spacing-tight`), coverage line (16/24, secondary), then the coverage note when the persona has one. Unchanged content.
3. **Tab bar** (9.3), 32 below.
4. **The selected tab's content**, 12 below:
   - Needs you, Heads-up, Other mail: a list panel (`--column-list`, 416) and a detail panel (the rest), `--gap-column` apart, both aligned to the top. Each panel is as tall as its content.
   - Watchlist, Memory: one panel, full width.

Phone (below `--breakpoint-desktop`), page padding 8 top, 16 sides:

1. **Header:** the mark; on the right three 40 × 40 round buttons, 8 apart: Watchlist (eye icon), Memory (✦ icon), avatar. The first two are glass with `--size-icon-large` (20) icons in `--color-brand`. Unselected hover and press use `--color-glass-hover` and keep the icon `--color-brand`. The one whose view is open uses `--color-ink`, an icon in `--color-on-ink`, and `--shadow-tab-selected`; its appearance does not change on hover or press. Watchlist carries the news dot (9.3), 4 from the top and 4 from the inline end.
2. **Greeting block:** date, greeting (28/32, medium), coverage (14/20).
3. **Tab bar:** the three email tabs only, each a third of the width.
4. **List panel:** full width, radius `--radius-card`, 8 padding. A row opens the detail in the DetailSheet (9.8).
5. **Watchlist and Memory** replace everything below the header with one panel, under a “‹ Brief” text button (brand text, 16/24 semibold, 44 tall) that returns to the tabs.

The demo bar stays above the header as built (D19), without the theme control (D57).

### 9.3 TabBar (new)

Two glass groups on one row: left `Needs you`, `Heads-up`, `Other mail`; right `Watchlist`, `Memory` (`justify-content: space-between`).

- **Group:** glass (9.1), `--radius-pill`, 4 padding, 4 between tabs.
- **Tab:** 40 tall, padding 0 16, `--radius-pill`, 14/20 semibold, 8 between the name and the count. Count: medium weight, `tabular-nums`.
  - Default: transparent, `--color-text-secondary`; count `--color-text-muted`.
  - Hover and pressed: `--color-glass-hover` fill, `--color-text`.
  - Selected: `--color-ink` fill, `--color-on-ink` text, count `--color-on-ink-muted`, `--shadow-tab-selected`. No hover change.
- **News dot** (Watchlist only, when any item has news): 8 × 8, 4 from the top and 4 from the inline end, `--color-brand`; on the selected tab `--color-on-ink`. The tab's accessible name adds “, new”.
- **Counts:** Needs you = open items (not done, snoozed or moved away); Heads-up and Other mail = emails in that tab (Other mail uses `otherMail.total`, adjusted by moves); Watchlist = items; Memory = instructions plus learned.
- **Roles:** each group is a `tablist` labeled “Email” or “Glance”; tabs are `tab` with `aria-selected`; arrow keys move within a group, Tab leaves it. The content region is a `tabpanel`.
- **Phone:** one group, full width, tabs share it equally; 12/16 semibold if the labels do not fit at 14.

The tab remembers its selected row for the session. Opening a tab for the first time selects its first row on desktop and nothing on the phone.

### 9.4 List panel and rows

**List panel:** `--color-surface`, `--radius-card`, `--shadow-panel`, 8 padding. Rows sit 4 apart. Desktop rows have no dividers; on the phone the built divider rule stays.

**Panel head (Needs you only):** 8 12 4 padding. Left: “By deadline, then amount” (12/16, muted). Right: “1 of 4 done” (12/16, muted) and the ProgressBar. Replaces the SectionCard header.

**BriefRow (changed):**

- Radius `--radius-panel`, padding 16, a 16 chevron on the right (`--color-icon-muted`; `--color-brand` when selected), on desktop too.
- Selected: `--color-row-selected` fill, a `--border-hairline` inset ring in `--color-brand-stroke`, `--shadow-row-selected`; the rank turns `--color-brand-text`. Selected rows do not change on hover or press.
- Everything else as built, including AccountLabel, Badge and the two-line request.

**FactChip (changed, D51):** padding 4 8, 12/16 semibold, `--radius-pill`. Not urgent: fill and text by kind (`--color-money-tint` + `--color-money-text`, `--color-time-tint` + `--color-time-text`, `--color-people-tint` + `--color-people-text`), no dot. Urgent: as built (solid `--color-urgent`, white text, white dot, padding 4 12 4 8).

**HeadsUpRow (replaces KnowRow):** a button row, same radius, padding, chevron and states as BriefRow.

- The 32 icon tile as built (kind tint, kind-text icon; neutral tile for moved items).
- “**Title**” then the text, 14/20, title semibold in `--color-text`, text in `--color-text-secondary`. No underlined value in the row: the source is in the detail.
- Optional AccountLabel after the text.

**OtherMailRow (new):** a button row, same states.

- Line 1: sender (14/20 semibold) and, right-aligned, the time (12/16, muted).
- Line 2: subject (14/20, secondary), one line, ellipsis.
- Line 3: ✦ (brand) and the reason (12/16, muted), one line, ellipsis.
- After the last row: “N more like these” (12/16, muted, 12 16 padding), plain text, where N = total minus the rows listed. Hidden when N is 0.

**Moved rows.** An email moved into a tab uses that tab's row and this content:

| Email came from | Title | Line |
| --- | --- | --- |
| Needs you | `name` | the request text (with its quote marks if it is a quote) |
| Heads-up | `title` | `text` without its leading “: ” |
| Other mail | `sender` | `subject` |

- In Needs you: BriefRow with the title as name and the line as request, no chips, the next rank number.
- In Heads-up: “**Title**: line”, a neutral tile with the move icon.
- In Other mail: title as sender, line as subject, no time.
- In all three, the last line is “Moved by you” (12/16 semibold, `--color-brand-text`) in place of chips or the reason.

**DoneRow** is unchanged and sits under the Needs you rows (D54). Its `moved` kind is no longer used.

### 9.5 Detail panel

`--color-surface`, `--radius-card`, `--shadow-panel`, padding 24 28 28.

- **Top row:** position on the left (“Needs you · 1 of 3”, “Heads-up · 2 of 3”, “Other mail · 1 of 31”; 14/20 medium, muted) and the SegmentedControl on the right.
- **SegmentedControl (changed):** track and sizes as built. Selected segment: `--color-ink` fill, `--color-on-ink` text, no shadow. A new `size="small"`: track padding 2, segments 24 tall, padding 4 8, 12/16 semibold; used for the theme control in the account menu on desktop.
- **Needs you detail:** as built (title, Person, AccountLabel, request, GlanceMark, hint line, SceneCard, SourcePanel, ReasonPill and ReasonPanel), with the action bar in 9.6.
- **Heads-up detail:** tabs `Details` and `Original email`.
  - Details: title (20/28 semibold); Person line built from the source (“Lena Ortiz · Wed, Nov 4, 5:30 PM”) with AccountLabel when needed; GlanceMark with its label; `summary` as the headline (20/28 semibold); the SourcePanel for `fact.source`, always open, no close button; when the item has a `judgment`, a ReasonPill “Why it’s here: {label}” that opens the read and its source; when it has `watch`, “Part of **Watchlist: {name}**” (14/20, the name a brand text button that opens the Watchlist tab).
  - Original email: EmailView with `email` and the date from `fact.source.when`.
- **Other mail detail:** no tabs.
  - Subject as the title (20/28 semibold); Person line “{sender} · {when}”.
  - The reason line, 24 below: ✦, “Glance put this in Other mail: **{reason}**” (14/20; the reason semibold in `--color-text`), then a tag when `basis` is set: “Your instruction” or “Learned” (14/20 semibold, `--color-brand-text` on `--color-brand-tint`, padding 0 8, radius 8).
  - The email body in a `--color-surface-muted` block, radius `--radius-panel`, padding 20 24, paragraphs in `Reading` style 16 apart, highlights as in EmailView (`judg` uses `--color-judgment-ink`).
  - The legend, 12 below, 12/16 muted: a `judgment`-ink sample “Highlighted”, “what Glance used to sort it.”, then a money-ink sample “Amounts” “and” a time-ink sample “dates” “are marked too.” Show only the kinds that appear in the email; with only `judg`, the sentence ends after “sort it.”
- **Moved emails** keep the detail of where they came from. Under the Person line they show “You moved this here. Glance will sort emails like it the same way.” (14/20, `--color-brand-text` on `--color-brand-tint`, padding 8 12, radius 12).
- **Empty tab:** the list panel shows “Nothing here.” (16/24 semibold) and “Emails you move to {tab} will show up here.” (14/20, muted), centered, 40 padding; there is no detail panel. Needs you with everything done keeps the built AllDone.

**ReasonPill (changed):** ring is `--border-hairline` in `--color-brand-stroke`. Label: “Why it’s {ordinal}” plus “: {first judgment label}” when the item has a judgment (“Why it’s first: Renewal risk”, “Why it’s second”). Ordinals are words up to tenth; after that “Why it’s ranked 11th”. A chevron at the end points down, and up while open. Moved items have no pill.

**ReasonPanel (changed):** title and judgments as built. The “Not for you?” block and its button are removed (D53). When the item has `watch`, a last line under a hairline: “Based on **Watchlist: {name}**”, the name a brand text button that opens the Watchlist tab.

### 9.6 Action bar

One primary, then outline buttons (D12, D53). Ask is no longer in the bar; it is the third tab (D61).

| Detail | Left | Right |
| --- | --- | --- |
| Needs you | Open in {app} (primary, external) | Snooze · Move to · Done (outline, `compact` on desktop) |
| Needs you, checklist complete | Open in {app} (outline) | Move to (outline) · Mark done (primary) |
| Heads-up, Other mail, and anything moved there | Open in {app} (primary) | Move to (outline) |

- Icons: Snooze clock, Move to the move icon and a trailing chevron-down, Done check.
- Phone: the primary is full width on its own row; the outline buttons share the second row equally (`touch` size, 44).
- Outline buttons use the built states (`--color-sunken-hover`, `--color-sunken-pressed`); the button whose menu is open keeps the pressed fill.

### 9.7 MoveMenu and Toast (new)

**MoveMenu** opens above the Move to button, right-aligned, pushing nothing; on the phone it spans the action bar.

- `--size-menu` wide, `--color-surface`, `--radius-panel`, `--border-hairline` inset ring in `--color-border`, `--shadow-popover`, 8 padding.
- Head “Move to” (12/16 semibold, muted, padding 8 12 4).
- Three items, each 52 tall, radius 12, padding 8 12: a 16 check slot, the tab name (14/20 semibold) and a description (12/16, muted): “You need to act”, “No action needed”, “Not for you”.
- The tab the email is in shows the check in `--color-brand`, has `aria-disabled="true"` and no hover. The others hover with `--color-row-hover` and press with `--color-row-pressed`.
- Foot, above a hairline: a bulb icon and “Glance learns from every move.” (12/16, muted).
- `role="menu"` with `menuitem`s; focus moves to the first enabled item; Escape and an outside click close it and return focus to the button.

**Choosing a tab:** the email leaves its list with the collapse motion, joins the end of the destination list as a moved row, the counts update, the next row in the source list becomes selected (on the phone the sheet closes), and the toast appears. Moving an email back to where it came from removes “Moved by you”.

**Toast:**

- Centered at the bottom of the viewport, 24 from the edge (16 on the phone, above the safe area). `--color-ink` fill, `--color-on-ink` text, `--radius-panel`, `--shadow-popover`, padding 12 16, 12 between parts. Desktop width between `--size-toast-min` and `--content-narrow`; phone full width minus 16 margins.
- Parts: a check icon; the message (14/20: the first sentence semibold, the rest regular at 72% via `--color-on-ink-muted`); “Undo” (text button, `--color-on-ink-link`, semibold); a close IconButton.
- Control states: the close icon uses `--color-on-ink-muted` at rest and `--color-on-ink` on hover and press. Undo keeps `--color-on-ink-link`; hover and press add `text-decoration: underline` with an offset of `--space-2`. Fills stay transparent, and both controls keep the shared keyboard-focus outline.
- One toast at a time; a new one replaces the old. It stays 6 seconds, pauses while hovered or focused, and enters with the enter motion.
- `role="status"`. Undo restores the exact previous state, including selection.

Messages:

| Action | First sentence | Rest |
| --- | --- | --- |
| Move to | “Moved to {tab}.” | “Glance will sort emails like this into {tab}.” |
| Add to Watchlist | “Added to Watchlist.” | “Emails about it will go to the top.” |
| Rename a Watchlist item | “Saved.” | — |
| Remove from Watchlist | “Removed from Watchlist.” | — |
| Add an instruction | “Saved as your instruction.” | “Glance follows it from the next email.” |
| Edit an instruction | “Saved.” | — |
| Edit a learned pattern | “Saved as your instruction.” | “Your instructions always win.” |
| Remove from Memory | “Removed from Memory.” | — |

### 9.8 DetailSheet on the phone

The sheet, its gestures, focus trap and closing rules stay as built (D44). Inside it:

- First row: the position text and the close button. Below it the tabs become **underline tabs**: full-width row with a hairline along the bottom; each tab 16/24 medium, `--color-text-secondary`, 44 tall, 24 apart; the selected one is semibold `--color-text` with a 2 px `--color-brand` underline. Same roles and keys as SegmentedControl.
- Content as in 9.5 with 20 side padding; the scene card fields are two per row.
- The action bar stays pinned to the bottom of the sheet as built, with the layout in 9.6.
- Other mail and Heads-up emails open in the same sheet.

### 9.9 Watchlist (new)

One panel, padding 32 40 40 (phone: 24 20).

- **Head:** “Watchlist” (24/32 semibold); under it “Things you’re waiting on. Any email about them goes to the top of your brief.” (14/20, secondary, max 560). On the right an outline Button “+ Add” (`compact`).
- **Add row** (shown after Add, 16 below the head): a TextInput and the buttons Add (primary, `compact`, disabled while the input is empty) and Cancel (outline, `compact`); below it “✦ Glance looks for emails about it and puts them at the top.” (12/16, muted). Enter adds, Escape cancels. The new item goes first with the status “Nothing yet” and no news. Focus returns to the Add button.
- **WatchRow** (rows separated by hairlines, 12 16 padding, 64 min height): an eye icon (16, `--color-brand`); the name (16/24 semibold); the status (14/20, muted); then “N new” or “Nothing new”; then two IconButtons, Rename (pencil) and Remove (trash), `compact`, icon `--color-text-muted`.
  - “N new”: a pill button, `--color-brand-tint` fill, `--color-brand-text`, 14/20 semibold, padding 4 8 4 12, a trailing chevron. It opens the tab that holds `item` and selects it (on the phone it opens the sheet).
  - “Nothing new”: plain text, 14/20, muted.
  - Desktop: one line, the name and status on the left sharing the free space, then the news, then the buttons. Phone: two lines; name and buttons on the first, status and news on the second. Long names wrap.
- **Rename** turns the row into a TextInput with Save (primary, `compact`) and Cancel. **Remove** removes the row and shows the toast.
- **Empty:** “Nothing on your Watchlist.” and “Add something you’re waiting on, like a contract or a reply.”

### 9.10 Memory (new)

One panel, same padding. Head: “Memory” (24/32 semibold) and “Glance sorts your email with what you tell it and what it learns. Change anything here.”

Two sections, 32 apart:

- **Your instructions {count}** (16/24 semibold; the count muted, regular), hint “Rules in your own words. They always win.” (14/20, muted), and “+ Add” on the right, which opens the same add row as Watchlist with the note “✦ Glance follows it from the next email.”
- **Learned {count}**, hint “Patterns from what you read and move. Edit one and it becomes your instruction.”

**MemoryRow** (hairline above, padding 16 0): a 16 mark (an opening quotation mark in `--color-brand` for instructions; a bulb icon in `--color-brand` for learned), the text (16/24, `--color-text`), under it the meta (14/20, muted: “Added Oct 28”, “From 4 opens · Oct 20”), and on the right Edit and Remove IconButtons. On the phone the two buttons sit on their own line under the meta, aligned right.

- Edit turns the text into a TextInput with Save and Cancel. Saving an instruction keeps its place. Saving a learned pattern moves it to the end of Your instructions with the meta “Was learned · edited just now”.
- New instructions get the meta “Added today”.
- Remove removes the row and shows the toast.

Watchlist and Memory changes last for the session and reset with the persona, like every other demo state.

### 9.11 TextInput (new)

48 tall, padding 0 16, radius 12, `--color-surface`, 16/24 `--color-text`, placeholder `--color-text-muted`. Ring: `--border-hairline` inset in `--color-border-strong`; focused: `--border-selected` in `--color-brand` and no extra outline. It always has a visible or `aria-label` label. Placeholders: “What are you waiting on?” (Watchlist), “Tell Glance a rule, in your own words” (Memory).

**InlineForm on the phone:** below the existing desktop breakpoint, the input fills the first row; the compact submit and Cancel buttons keep that order on a second row, start-aligned with 8 between them.

### 9.12 Account menu and theme (new)

The avatar is a 40 × 40 round button on desktop and phone (`--color-brand-tint`, `--color-brand-text` initial, 14/20 semibold). It opens a menu under it, right-aligned, 8 below:

- `--size-menu` wide, `--color-surface`, `--radius-panel`, hairline ring, `--shadow-popover`, 8 padding.
- Identity: the avatar (32), the name (14/20 semibold) and the email (12/16, muted). A hairline.
- “Inboxes” with “{n} connected” on the right (12/16, muted) and “Settings”: 44-tall items with a 16 icon, 14/20 medium, radius 12, row-hover states. Both open Settings (Inboxes scrolls to that section).
- “Appearance” with the theme control on the right: SegmentedControl `small` with System, Light, Dark. On the phone the label sits above a full-width regular SegmentedControl.
- A hairline, then “Log out”, which opens the signed-out page.
- Menu roles and closing as MoveMenu.

The theme choice is stored as today (`themePreference`), applies at once, and is the same control in Settings.

### 9.13 Settings and the signed-out page (new)

**Settings** replaces the brief below the header. A “‹ Back to brief” text button, the title “Settings” (32/40 semibold), then a 200-wide section list on the left (Inboxes, Brief, Notifications, Quiet hours, Appearance, Account; anchor links, the current one `--color-text` semibold) and the sections on the right, each a panel (`--radius-card`, `--shadow-panel`, padding 24 28) with a 20/28 semibold title, 16 apart. On the phone there is no section list.

| Section | Content |
| --- | --- |
| Inboxes | One row per `accounts` entry: the app name (16/24 semibold), “{email} · connected Oct 28” (14/20, muted), an outline “Disconnect”. Then “Connect another inbox” with “Gmail, Outlook or Yahoo Mail” and an outline “Connect”. Then the note “Glance reads your email to brief you. It never sends, deletes or changes anything in your inbox.” |
| Brief | “Morning brief” with “Each brief covers the email since your last one.” and a time select showing “7:30 AM”. |
| Notifications | Three Switch rows: “Brief is ready” (on), “Something on your Watchlist changes” (on), “A Needs you item is due today” (off). |
| Quiet hours | A Switch row “Hold work email in the evening” with “Nothing from {work app} reaches you between these times.”, then From “7:00 PM” and Until “7:00 AM” selects. On for Daniel, off for the others. |
| Appearance | “Theme” with the regular SegmentedControl: System, Light, Dark. |
| Account | Avatar, name, email and an outline “Log out”. Below a hairline: “Delete Glance data”, “Removes your Memory: what you told Glance and what it learned. Your inbox isn’t touched.” and a text button “Delete” in `--color-danger-text`. |

Demo behavior, so that nothing is a dead control (D29): switches and selects change and keep their value for the session. Disconnect, Connect and Delete each open a small confirmation panel in place (the SnoozeMenu surface) reading “This is a demo. Nothing was changed.” with one outline “OK”. Log out opens the signed-out page.

**Signed out:** the mark, then a centered panel (max 416): “You’re signed out” (24/32 semibold), “Sign in to see your brief.” (16/24, secondary), two outline Buttons, full width, 48 tall: “Continue with Microsoft” and “Continue with Google”, and the same privacy note as Inboxes (12/16, muted). Either button returns to the brief.

### 9.14 Components retired

`CollapsedGroup`, `SetAsideList` and `SectionCard` are no longer used by the app. They stay in the library only while an edge-state story still uses them; edge states under tabs are a later round (see `docs/handoff/v2/README.md`).

### 9.15 Storybook

New and changed components get stories for every state named here, in light and dark, as before. Add a `Patterns/Brief with tabs` story per persona and one for the phone.
