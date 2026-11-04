# Glance — Design Rules

**Status:** v1.0 (handoff)
**Owner:** Shuhao Shang (Design)
**Related:** [Product brief](product-brief.md) · [Design system](design-system.md) · [Decisions](decisions.md) · [Data model](data-model.md)

These rules turn the product principles into decisions that designers, engineers and AI agents can apply the same way every time. If a screen breaks a rule, either the screen changes or this document does, through a pull request.

---

## 1. Two kinds of content

Everything in a brief is one of two things, and the user must always be able to tell which.

|          | Facts                                                                      | Glance’s words                                                  |
| -------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| What     | Taken from the email as written: amounts, dates, names, requests           | Written by Glance: summaries, judgments, ranking reasons        |
| Marker   | Quotation marks for sentences; fact pills for values                       | ✦ icon in purple                                                |
| On tap   | Shows the source sentence, highlighted                                     | Shows the reasoning, and its source if it has one               |
| Examples | “Can you send revised pricing before our review on Friday?” · `$48,000/yr` | ✦ Renewal risk · ✦ Sign Ella’s museum trip slip and pay the fee |

Rules:

- **Quotation marks mean verbatim.** Never put quotation marks around text Glance wrote.
- If an email contains an explicit request, show the request as a quote. If it does not (school notices, bills, system notifications), show a ✦ summary labelled “Glance’s summary · not the sender’s words”.
- A judgment that draws on another email must link to that email.

## 2. Ranking

Items in **Needs you** are ordered by **urgency first, then value**.

An item is **urgent** when any of these is true:

- it is due today or tomorrow, or overdue
- someone has been waiting on the user for 2 days or more

Within the same urgency, larger amounts and explicit requests to the user rank higher. Every item can explain its position (“Why 1st: …”) on request.

## 3. Color

Color carries meaning. Hue says **what kind** of information something is; a solid fill says it is **urgent**.

| Role    | Token                  | Value     | Used for                                                     |
| ------- | ---------------------- | --------- | ------------------------------------------------------------ |
| Glance  | `color.brand`          | `#5A4FE0` | Primary action, selection, progress, sources, Glance’s words |
|         | `color.brand.text`     | `#4A3FD0` | Text and links on white or tint                              |
|         | `color.brand.tint`     | `#EEECFD` | Selected rows, secondary buttons, source highlight           |
| Money   | `color.money.dot`      | `#9A7300` | Type dot on fact pills                                       |
|         | `color.money.tint`     | `#FFF2C2` | Icon tiles                                                   |
|         | `color.money.text`     | `#6B5100` | Text on money tint                                           |
| Time    | `color.time.solid`     | `#C2255C` | Urgent fact pills (white text)                               |
|         | `color.time.tint`      | `#FFE3EB` | Icon tiles                                                   |
|         | `color.time.text`      | `#A8164C` | Text and icons on time tint                                  |
| People  | `color.people.dot`     | `#2F64D6` | Type dot on fact pills                                       |
|         | `color.people.tint`    | `#E3ECFF` | Avatars, icon tiles                                          |
|         | `color.people.text`    | `#1D4BAE` | Text on people tint                                          |
| Neutral | `color.bg`             | `#F4F4F7` | Page background                                              |
|         | `color.surface`        | `#FFFFFF` | Cards                                                        |
|         | `color.surface.muted`  | `#F7F7FA` | Panels inside cards: sources, scene cards, reasoning         |
|         | `color.surface.sunken` | `#F0F0F4` | Fact chips, segmented controls, neutral buttons              |
|         | `color.text`           | `#16151C` | Primary text                                                 |
|         | `color.text.muted`     | `#6A6875` | Secondary text                                               |
|         | `color.border`         | `#ECECF1` | Dividers                                                     |

Rules:

- **Purple is the only large color area on a screen.** Category colors never fill a card or a band, so the screen does not change color from day to day.
- **Fact pills are neutral with a type dot.** Only urgent facts become solid (`color.time.solid`).
- **Never rely on color alone.** Every colored element also has a text label.
- **Pastels are highlighter ink.** Tints mark words in emails and source excerpts (money `#FFE49A`, time `#FFD5E2`, people `#D6E4FF`, Glance’s evidence `#E3DEFF`) and fill small icon tiles. They never fill whole sections.

## 4. Facts, chips and scene cards

- Facts have three types only: **time, money, people**. Actions (sign, pay, reply) are not facts.
- **List rows are uniform.** Every item uses the same row and shows up to 2 fact chips (urgent first). The request may take two lines on desktop and phone, then an ellipsis; it is the most important text in the row (D27, D40).
- **Detail views use a scene card** chosen by the email’s structure: deal, decision, approval, payment, mismatch, event, range, checklist. Emails with no stable structure use the text fallback: an underlined list of facts, no card.
- Scene cards hold **only facts from the email**. Glance’s judgments stay in “Glance’s read”.
- Inside a card, a value with a source has a dotted underline in its type colour; a value without one is plain text. See `docs/design-system.md` §5 for every type and when to use it.

## 5. Sources

- Every underlined value opens its source. Sources are **closed by default**.
- **Every fact in the brief has a source, Good to know included.** Each Good to know row underlines one value; it opens the source inline below the row (D38).
- **Desktop:** the source opens inside the item, below the scene card. It never covers other items.
- **Mobile:** the source opens in a bottom sheet with an “Open in [email app]” action.
- The source’s words are highlighted in the color of their type; the fact the user tapped also gets a 1.5 px ring in its type’s dark color.
- The original email view highlights every fact Glance used, by type, with a highlighter switch. Type labels appear on hover or tap, not inline.

## 6. Accounts

- With one connected account, account labels are hidden.
- With several, the coverage line shows the split (“Work 64 · Personal 8”), and **only items from the less common account carry a label**. Mark the exception, not the rule.
- Per-account time rules are shown under the coverage line, named as a setting: “Quiet hours: work email hides after 7:00 PM”.
- Account labels are outlined (white, 1 px ring), never filled. Filled grey belongs to fact pills, so a filled label would read as a fact.

## 7. Tiers and naming

| In code | On screen        | Behaviour                                         |
| ------- | ---------------- | ------------------------------------------------- |
| Act     | **Needs you**    | Ranked list; one item selected                    |
| Know    | **Good to know** | Short list; facts and ✦ judgments as in section 1 |
| Ignore  | **Set aside**    | Collapsed with counts; always openable            |

Nothing disappears silently: every count on screen can be opened.

## 8. Item lifecycle

- **Done** comes from two places: Glance detects the action in the email app (“reply detected in Outlook, 9:14 AM”), or the user marks it done.
- Done items move below the list with an **Undo** action.
- When nothing is left: “Nothing else needs you today”, followed by what is still in Good to know and Set aside.
- **Show in brief** (in Set aside) moves an email to Good to know, marked “Moved by you”, lowers the Set aside count and teaches Glance. It can be undone from the same row.
- **Move to Set aside** is the opposite, for a Needs you item that doesn’t need the user. It sits at the end of Glance’s reasoning (“Not for you? Glance will rank emails like this lower.”). The item collapses like Done, a row “**Name** · moved to Set aside by you” with Undo appears under the list, it is no longer counted as an action, and it shows in Set aside under “Moved by you” with “Back to Needs you” (D37). It is never counted as done.
- Nothing that looks pressable is inert. If a control can’t act in the demo, it is plain text.
- **Checklist ticks are the user’s notes.** They never mark the item done. When every step is ticked, **Mark done** becomes the primary, “Open in {app}” turns neutral and Snooze steps aside, with the note from `scene.doneNote` (D34).

### States the brief must handle

- **First brief:** say what Glance is doing and how far along it is (“312 of 480 emails”), show the shape of the brief as a skeleton, never placeholder content, and state that access is read-only.
- **New mail while reading:** the brief never reshuffles. New mail waits in a row at the top of Needs you (“2 new since 7:12 AM · Add to brief”); the coverage line shows when it was last updated.
- **An inbox is disconnected:** say what is missing in three places: the coverage line (“from 1 of your 2 inboxes”), a notice with the one primary action (Reconnect), and the section header (“From Gmail only”). A partial brief must never look complete.
- **Quiet hours:** show only the accounts the rules allow, and say what is waiting and when it will appear (“12 work emails arrived after 7:00 PM. They’ll be in tomorrow’s brief at 8:00 AM.”), with “Show work email anyway” as a text button (D35).
- **Overload:** Needs you keeps to one screen. The phone shows the top 4 and “Show N more, ranked the same way”; Good to know and Set aside collapse into single rows with counts.

## 9. Layout

- **Desktop:** coverage line on top; list on the left (Needs you, Good to know, Set aside); the selected item in detail on the right.
- **Mobile:** coverage line, list, and a bottom sheet for details and sources. Frames include the 48 px status bar and the home indicator; nothing interactive sits under either.
- **One solid primary button per view,** and it follows the person’s next step: “Open in {app}” by default, “Mark done” once every checklist step is ticked. Other actions use the tint or neutral style.

## 10. Typography

Inter, with proportional figures. Tabular figures only where numbers must line up in a column; Inter’s tabular setting also widens hyphens, so “add-on” reads as “add - on” in prose. Every size and line height is an even number, and every line height is a multiple of 4, so text sits on the same 4 px grid as the layout. Line heights are written in px, never as ratios like 1.45.

| Style   | Size / line height / weight              | Use                                                           |
| ------- | ---------------------------------------- | ------------------------------------------------------------- |
| Display | 28 / 32 / 700, −0.03em (desktop 32 / 40) | Page greeting                                                 |
| Request | 20 / 28 / 600, −0.015em                  | The ✦ summary or quoted request in detail view                |
| Title   | 18 / 24 (phone), 20 / 28 (desktop) / 700 | Item name in detail view; always smaller than the request     |
| Section | 18 / 24 / 700                            | Section headings, wordmark                                    |
| Body    | 16 / 24 / 400–600                        | Default text, row titles (16 / 20), primary button            |
| Reading | 16 / 28 / 400                            | Email and source text, where words get highlighted            |
| Meta    | 14 / 20 / 400–600                        | Dates, secondary lines, tabs, secondary buttons, detail pills |
| Chip    | 12 / 16 / 500–600                        | List-row pills, account labels, legends                       |

- Text people type is never below 16 px, so iOS does not zoom the page.
- Font sizes only need to be even; they are never halved in a layout. What takes up space is the line height, and every line height is a multiple of 4.

## 11. Shape and spacing

- **Spacing scale:** 2, 4, 8, 12, 16, 20, 24, 32, 40, 48. Everything is a multiple of 4, so half of any value is still even and centering never lands on a half pixel. 2 is the only half step, used for hairline gaps (highlight padding, the gap between tabs, a label’s vertical padding).
- **Fixed sizes:** touch targets 44 (40 inside a toolbar or a tab group), primary button 48, avatars 32 / 24, icon tiles 32, icons 12 / 16 / 20, type dots 8.
- **Pills:** list chips 12 / 16 text, padding 4 12 4 8 (the dot side is 4 tighter so the dot doesn’t look adrift), dot gap 4; detail pills 14 / 20 text, padding 8 12, dot gap 8. Outlines are drawn as an inset ring, so selecting a pill never changes its size.
- **Radius:** sheets 24, cards 20, inner panels 16, small panels 12, icon tiles 8, highlights 4, pills, switches and buttons 999.
- **One scale, two densities.** Phone and desktop use the same scale; desktop picks larger steps instead of new numbers.

|                              | Phone                    | Desktop                  |
| ---------------------------- | ------------------------ | ------------------------ |
| Page gutter                  | 16                       | 32                       |
| Card padding                 | 16 (lists 4 0, rows 12)  | 20–24 (lists 8, rows 12) |
| Reading panel padding        | 20 (sheets)              | 24 top, 32 sides         |
| Gap between sections         | 20                       | 32                       |
| Column gap                   | —                        | 32                       |
| Greeting                     | 28 / 32                  | 32 / 40                  |
| Request (quote or ✦ summary) | 20 / 28                  | 24 / 32                  |
| Item name in detail          | 18 / 24                  | 20 / 28                  |
| Buttons                      | 48 primary, 44 secondary | 48 for all               |

- **Phone exceptions.** On the phone, what looks right wins over the scale when they conflict. Each exception is written down here with its reason; an unwritten off-scale value is a bug. (None so far.)
- **Exempt from the even rule:** line widths (1 px dividers, 1.5 px selected outlines and focus rings), letter-spacing, and documented optical nudges. Prefer layout over nudges: an icon button lines its icon up with the text edge by aligning it inside its 44 px hit area, not with a negative margin.

### Motion

Motion only shows cause and effect; nothing moves for decoration.

- **Source reveal:** the source panel fades in (200 ms), then the highlighter sweeps across the exact words left to right (480 ms), then the type ring appears (200 ms). The order says “these words, from this email”.
- **Highlighter switch:** highlights draw in or wipe out the same way (360 ms).
- **Done and snooze:** the row collapses (320 ms), the next item is selected, and the item reappears in the done list with Undo.
- **Everything else:** 160 ms colour changes on hover, selection and tabs.
- Easing `cubic-bezier(0.2, 0.7, 0.2, 1)` for sweeps, `ease` for the rest. With reduced motion turned on, every animation finishes at once.

## 12. Formatting

US English throughout.

- Dates: “Thursday, November 5”, “Nov 15”, “Fri”
- Times: “8:41 AM”
- Money: “$48,000/yr”, “$68.40”
- Relative time is preferred when it is shorter: “tomorrow”, “Waiting 2 days”

## 13. Accessibility

- Touch targets at least 44 × 44 px.
- Text contrast WCAG AA in every theme; non-text indicators at least 3:1.
- Everything that opens on hover also opens on tap and with the keyboard.
- Real buttons and links only; visible focus states.
- Respect reduced-motion settings.

## 14. Demo controls

The persona switcher and simulations live in a dark bar labelled “Demo controls · Not part of the product”, separate from the product interface.

## 15. Not decided yet

These are designed in principle (product brief §11–14) but have no screens yet. Each is a backlog issue; none should be built until its design lands in a PR.

- **Flag a wrong fact:** the user marks a value as wrong; the item falls back to showing the original sentence.
- **Uncertainty:** how Glance shows two possible deadlines in one email without breaking “quiet by default”.
- **First-brief guidance:** a one-time hint explaining the three sections and that underlined values open their source.
- **Long names, long amounts and mixed-language emails.**
- **Connect inboxes and Settings** (product brief Phase 2).
- **The morning notification:** how Glance tells the user the brief is ready (“3 need you · school form due tomorrow”), when it is sent, and how quiet hours apply to it.
- **“Show work email anyway”** in quiet hours: what it shows and for how long.
