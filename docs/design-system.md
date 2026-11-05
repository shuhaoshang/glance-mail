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
| `variant`  | `primary` (brand fill, one per view) · `tint` (brand tint) · `neutral` (sunken) · `text` (brand text, no fill)           |
| `size`     | `default` (48) · `touch` (44, selected by phone layouts for secondary buttons) · `compact` (40, toolbars and tab groups) |
| `icon`     | optional leading or trailing icon (16)                                                                                   |
| `external` | shows the external-link icon (for "Open in Gmail")                                                                       |

**States:** default, hover, focus-visible (2 px brand outline, 2 px offset), pressed, disabled.

Hover and pressed use the interactive color tokens above and the 160 ms fast transition. Tint buttons keep `--color-brand-text` in both states; neutral buttons keep `--color-text`. Text buttons stay transparent and use `--color-brand-text-hover` for both hover and pressed.

Disabled primary, tint, and neutral buttons use `--color-surface-sunken` with `--color-text-muted`. Disabled text buttons stay transparent with `--color-text-muted`. Any icons use `--color-icon-muted`. Disabled links follow the same variant rules. Hover and pressed do not add a ring; the outline marks keyboard focus.

### IconButton

44 × 44 hit area (40 compact) around a 16–20 icon. `aria-label` is required.

The background is transparent at rest. Hover shows a `--color-sunken-hover` circle, and pressed uses `--color-sunken-pressed`. Disabled stays transparent with `--color-icon-muted`. The focus-visible outline follows Button.

### SegmentedControl

Used for the detail tabs (Details · Original email · Ask) and the demo-only level switch.

- Sunken track with 4 px padding.
- The selected segment uses the surface fill and `--shadow-tab`.
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

**Without a fact:** the field is plain text. It is not focusable, and it has no underline.

The enclosing item resolves the fact ID and supplies its `kind` plus `onSelect(factId)`. `selected` is controlled by that item, and `sourcePanelId` links the trigger to its source region. Enter or Space opens the source; closing the connected example restores focus to the field.

Keyboard focus uses the same 2 px brand outline and 2 px offset as the other primitives. Hover and pressed keep the field's existing appearance until fact-specific interaction colors are approved; the Interactive colors table currently defines button states only.


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
  - Last, under a divider: “Not for you? Glance will rank emails like this lower.” with a neutral outlined button “Move to Set aside” (tray-arrow icon). See design-rules §8.

### DateTile

A 56 × 56 tile: month on top (12/16, `--color-time-text`), day below (24/28 bold).

### Person

A 24 avatar (people tint, initial), followed by name and role.

### Checkbox

- Box: 24, radius 8, 1.5 px ring in `--color-icon-muted`.
- Checked: brand fill with a white check.
- Hit area: 40.
- Role: `checkbox`.

### Switch

- Track: 36 × 20. Knob: 16.
- On: brand. Off: `--color-icon-muted`.
- Role: `switch`.

### ProgressBar

4 px tall, brand fill on a brand-tint track. Used for “1 of 4 done” and the first-brief reading progress.

### Skeleton

A gray bar with a shimmer (1.6 s). It only shows the shape of content that is about to arrive. Never put placeholder text in it.

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

**States:** default, hover, selected (brand-tint fill, `aria-pressed`), leaving (collapses over 320 ms), new.

### SectionCard

A white card that holds rows: `Needs you`, `Good to know`. The header shows the title, a count, and an optional right slot (progress, “Most urgent first”, “From Gmail only”).

### KnowRow (Good to know)

- A 32 icon tile (type tint, type-text stroke).
- Bold title, then text. One value in the text (`fact.value`) is a Field-style link: dotted underline in its type color, inked when open.
- Selecting it opens a SourcePanel inline below the row (`Source · from · when`, the sentence with the words highlighted in the type’s ink). Only one panel is open at a time.
- Optional AccountLabel.
- Optional ✦ judgment pill that expands its ReasonPanel inline.
- Rows the user moved here show “Moved by you” and have no fact (they are whole emails, not extracted facts).

### CollapsedGroup (Set aside)

A card button: “31 set aside” plus a breakdown (“18 newsletters · 9 CC’d · 4 promotions”) and a chevron. It is selected while the Set aside view is open.

### SetAsideList

Groups with a title and a count. Each row has a sender or subject, a subject line, and a “Show in brief” text button. A kept row shows “✓ In Good to know · Undo”. Below the rows: “+N more” as plain text, only when more exist.

When the user has moved items out of Needs you, the first group is **Moved by you**: each row shows the item name and its request, with a “Back to Needs you” text button.

### DoneRow

A brand check (a muted clock for snoozed items, a muted tray-arrow for items moved to Set aside), then “**Name** · what happened”, then an Undo text button. Done rows appear with a 240 ms fade-down.

### NewMailRow

The first row of Needs you when new mail has arrived: “● 2 new since 8:00 AM · Add to brief”. The brief never reshuffles on its own.

### Notice

A neutral card with an icon tile, a title and a body. It may hold one primary Button. It is used for a disconnected inbox.

### DetailPanel (desktop) / DetailSheet (phone)

- **Top row:** position (“Needs you · 1 of 3”) and the SegmentedControl.
- **Then:** Title, Person and AccountLabel, the request (with GlanceMark when it is a summary), “From the email · select an underlined value”, the SceneCard, the SourcePanel, the ReasonPanel trigger.
- **Bottom bar:**
  - Primary “Open in {app}”, followed by Ask (tint).
  - Snooze and Done (neutral), aligned right on desktop.
  - On phone, the primary button is full width on its own row.
  - **Checklist complete** (every step ticked): “Mark done” is the primary; “Open in {app}” becomes neutral; Snooze is not shown. On desktop Mark done stays on the right; on phone it takes the full-width row, with Open and Ask below.
- **Sheet (phone):** top 56, radius 24, 36 × 4 handle, scrim `--color-scrim`.

### EmailView

- Subject (20/28) and meta.
- A legend (Money · Time · People · Glance’s read) with a highlighter Switch.
- The body in `Reading` style, with every fact Glance used highlighted by type. A type label appears on hover or focus (as a `title`), not inline.
- Toggling the switch draws the ink in or wipes it out (360 ms).

### AskThread

- The user's question is a sunken bubble on the right.
- A **found** answer shows the ✦ Glance label, the answer, and a nested source (judgment ink).
- A **not found** answer shows a dashed-outline box titled “Not in your email”.
- Suggestions are outlined pills.
- **In the demo there is no input.** Answers are prepared in advance, so a dashed note replaces it: “**Demo:** answers are prepared in advance, so pick a question above. In the product you type your own.” When every question has been asked: “**Demo:** that’s every prepared question for this item.” An input that never answers would be a dead control (D39).
- In the product, the input row has a tint send button. It is not the primary, because the view already has one.

### SnoozeMenu

A panel with three option pills and the note “It comes back to Needs you at that time.” Choosing an option collapses the row like Done.

---

## 5. Scene cards

A scene card holds **only facts from the email**, laid out by the email's structure. Judgments never go in the card.

**Container:**

- `--color-surface-muted`, radius 16, padding 16 20 20.
- Header: a Meta-style label on the left (“Renewal”, “Decision”…), with an urgent FactChip on the right when the item is urgent.

| Type        | Use when the email…                                   | Layout                                                                                     | Examples                                           |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `deal`      | is about an account with a value, a date and a status | three Fields in a row (default size)                                                       | Maya · Fernway renewal; Halden new lead            |
| `decision`  | offers named options and asks you to choose           | two option tiles (key badge, title, small Field)                                           | Daniel · Checkout redesign                         |
| `approval`  | asks you to approve an amount                         | large amount Field, then small Fields (for, requested by, deadline), then an optional note | Daniel · Expense report                            |
| `payment`   | is a bill or fee                                      | large amount Field, then due and payee                                                     | Sarah · City Water                                 |
| `mismatch`  | contains two numbers that should agree and don't      | two large Fields with a pink ≠ between them, then the deadline                             | Maya · Okto invoice                                |
| `event`     | sets one date and time                                | DateTile, then a time Field, a title and an instruction                                    | Sarah · Riverside appointment                      |
| `range`     | spans dates                                           | two DateTiles with an arrow, then the dates Field                                          | Daniel · Lea’s time off                            |
| `checklist` | asks for more than one step                           | Checkbox steps (inline Fields allowed), a divider, then due and context Fields             | Sarah · Lincoln trip slip                          |
| `text`      | has no stable structure                               | no card: an underlined list of the facts                                                   | Maya · Brightline question; Daniel · Riya feedback |

**Selection rules:**

1. The type comes from the data (`item.scene.type`). Components never infer it.
2. If the data has no scene, render `text`. Knowing when _not_ to use a component is part of the system.
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
| Brief layout       | **Phone:** coverage line, then Needs you, Good to know and Set aside, with a detail sheet. **Desktop (≥ 960):** list column 416 on the left and the DetailPanel on the right, with a 32 gap.                                                                                                                |
| Coverage line      | “38 emails overnight, all in Outlook.” Per-account rules sit under it (“Quiet hours: work email hides after 7:00 PM”).                                                                                                                                                                                      |
| Item lifecycle     | **Done** (manual or reply detected), **snoozed** (comes back at a time), **leaving** (collapse), then a done row with Undo. When nothing is left: “Nothing else needs you today”.                                                                                                                           |
| New mail           | NewMailRow. Adding it puts new items at the end of the ranking and adds the rest to Set aside.                                                                                                                                                                                                              |
| Show in brief      | A Set aside row moves to Good to know, marked “Moved by you”; the counts update; it can be undone.                                                                                                                                                                                                          |
| First brief        | Connected inboxes with checks, reading progress (“312 of 480 emails”), a skeleton of the brief, and “Read-only” reassurance.                                                                                                                                                                                |
| Disconnected inbox | Say what is missing in three places: the coverage line, a Notice with Reconnect (the one primary), and the section header (“From Gmail only”).                                                                                                                                                              |
| Quiet hours        | Phone, evening: the greeting changes (“Good evening, Daniel”), the coverage line says which inbox is shown (“Personal inbox only.”), a moon label says until when, and a calm card says what is waiting with “Show work email anyway” (text button). Good to know and Set aside show only allowed accounts. |
| Overload           | Needs you shows what fits one screen (phone: top 4), then “Show 8 more, ranked the same way”. Good to know and Set aside collapse into rows.                                                                                                                                                                |
| L1 / L2 / L3       | **Demo only.** The same facts as a paragraph, as formatted text, and as components.                                                                                                                                                                                                                         |
| Demo bar           | **Demo only.** Dark bar: persona switch, level switch, “Simulate {sender}’s reply”. Never styled like the product.                                                                                                                                                                                          |

---

## 7. Accessibility checklist (part of done)

- Contrast:
  - Text is AA in both themes (checked: muted text ≥ 4.97:1, white on brand ≥ 4.98:1).
  - Non-text elements (chevrons, switch off) are ≥ 3:1.
- Every interactive element is keyboard reachable and shows `:focus-visible`.
- Sources open by click or Enter, never only on hover.
- Screen-reader labels:
  - Fields read label, value and “Show where the email says so”.
  - FactChips read type and value.
  - Urgent chips include the word “urgent”.
- Live regions:
  - The progress line (“2 of 5 done”) is announced when it changes.
  - The “2 new” row is announced when it appears.
- Reduced motion turns off the sweep, collapse and fade.

---

## 8. Storybook structure

```
Introduction        What Glance is, how the system is organized, links to the app, prototypes and docs
Foundations/        Colors (light and dark), Type, Spacing, Radius, Motion
Primitives/         Button, IconButton, SegmentedControl, FactChip, AccountLabel, Badge, GlanceMark,
                    Field, Highlight, SourcePanel, ReasonPanel, DateTile, Person, Checkbox, Switch,
                    ProgressBar, Skeleton, Icons
Composites/         BriefRow, SectionCard, KnowRow, CollapsedGroup, SetAsideList, DoneRow, NewMailRow,
                    Notice, DetailPanel, DetailSheet, EmailView, AskThread, SnoozeMenu
Scene cards/        Deal, Decision, Approval, Payment, Mismatch, Event, Range, Checklist, TextFallback
Patterns/           Brief (desktop, phone), Edge states, Levels (L1/L2/L3)
```

Every story has a theme toggle (light and dark) and uses the persona data from `src/data/` where it can.

Storybook is also the system's documentation site (D41): it carries the Glance theme, opens on Introduction, has a docs page at the top of each category, and an autodocs page for every component. See issue 17.
