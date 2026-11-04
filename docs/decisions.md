# Glance — Decision Log

**Status:** Living document
**Owner:** Shuhao Shang (Design)
**Related:** [Product brief](product-brief.md) · [Design rules](design-rules.md)

Each entry records one decision: what was decided, what else was considered, and why. New decisions are added through pull requests, newest at the bottom. A decision that is later reversed stays in the log and gets a new entry that replaces it.

---

## Product

### D1 · A briefing layer, not an email client

- **Decision:** Glance reads and briefs. Replying, composing and searching stay in the user’s email app.
- **Considered:** A full AI email client with its own inbox and composer.
- **Why:** Gmail and Outlook already do composing and search well, and they have their own AI writing tools. Rebuilding them would not test the idea. The loop closes through progress: Glance detects when an item was handled in the email app and marks it done.

### D2 · A standalone responsive web app

- **Decision:** One web app for desktop and mobile browsers.
- **Considered:** A Chrome extension inside Gmail; a daily briefing email.
- **Why:** An extension works only in desktop Chrome and only with Gmail, inside Gmail’s visual style. A briefing email cannot support tap-to-verify or follow-up questions. The personas need phones and several email providers.

### D3 · Personas defined by situation, not job title

- **Decision:** Three personas chosen to put different kinds of pressure on the design: Maya (sales, money and customers), Daniel (manager, approvals, two inboxes), Sarah (parent, phone, school and household email).
- **Considered:** Work email user versus personal email user.
- **Why:** The design has to hold up across very different content. Maya’s structured sales email is the easy case; Daniel and Sarah are there to break rules.

### D4 · Three tiers: Act, Know, Ignore

- **Decision:** Every brief has the same structure. On screen: Needs you, Good to know, Set aside.
- **Considered:** Grouping by sender, by account or by date.
- **Why:** The user’s question is “what do I need to do?”, not “who wrote to me?”. The same structure works for all three personas.

## Trust

### D5 · Facts and Glance’s words look different

- **Decision:** Content is either a fact taken from the email as written, or Glance’s words (summaries, judgments, ranking reasons). Quotation marks mean verbatim; ✦ marks Glance’s words.
- **Considered:** Treating all AI output the same way; labeling only the summary.
- **Why:** In early versions, “Renewal risk” looked like a fact even though the word never appeared in the email. Trust depends on users knowing what the sender said and what the AI concluded.

### D6 · Sources on demand

- **Decision:** Every fact can be tapped to show the source sentence, highlighted. Sources are closed by default.
- **Considered:** Showing citations inline at all times; hover-only popovers.
- **Why:** Always-visible citations make the screen busy, and users return to the original email. A hover popover covered the next items and does not exist on phones. The source now opens inside the item on desktop and in a bottom sheet on mobile.

### D7 · Ask answers only from the user’s email

- **Decision:** The Ask panel has three answer types: an answer with its source, “Not in your email”, and a note when the question is outside what email can tell.
- **Considered:** A general AI assistant that answers anything.
- **Why:** A guessed answer looks the same as a real one. Saying “Not in your email” is what makes the other answers trustworthy.

## Prioritization

### D8 · Urgency first, then value

- **Decision:** Items are ranked by urgency, then by value. Urgent = due today or tomorrow, overdue, or someone has waited 2 days or more. Every item can explain its rank.
- **Considered:** Ranking by deal value only.
- **Why:** Ranking by value put a customer who had waited 2 days for a yes-or-no answer last. Explaining the rank lets users question it instead of silently distrusting it.

## Visual design

### D9 · White and pastel, Inter, iOS-like surfaces

- **Decision:** Light gray background, white cards, purple as the brand color, yellow, pink and blue as category colors, Inter with tabular numbers.
- **Considered:** Three directions in round 1: Boarding pass, Quiet journal, Morning edition.
- **Why:** The boarding pass taught the “small label, big value” pattern, which stayed; the ticket shape was decoration and was dropped. The editorial direction was the most restrained but felt distant for a daily tool. The final direction keeps type neutral so color and components carry meaning.

### D10 · Color has meaning

- **Decision:** Hue means type: yellow = money, pink = time, blue = people. A solid fill means urgent. Purple belongs to Glance and is the only large color area. Fact pills are neutral with a colored dot.
- **Considered:** Colored bands per item type; colored pills for every fact.
- **Why:** Colored bands made the screen change color every day. Colored pills on every row turned into confetti. Pink used for both “time” and “urgent” made a meeting tomorrow look like a customer waiting two days.

### D11 · List and detail

- **Decision:** On desktop, a ranked list on the left and the selected item in detail on the right. On mobile, a list and a bottom sheet.
- **Considered:** Three cards in a row (D), priority list with sidebar (E), one large “start here” card with a queue (F), grouped checklist (G).
- **Why:** D had no hierarchy. F was the clearest, but if the AI chose the wrong first item the whole page misled. G’s summary sentence was a paraphrase. List and detail lets users scan everything and verify one thing deeply.

### D12 · One primary action per view

- **Decision:** One solid purple button per view; other actions use tint or neutral styles.
- **Considered:** A primary button on every card.
- **Why:** In layout D, three purple buttons competed and none led.

### D13 · Fact pills carry only time, money and people

- **Decision:** Actions like sign, pay or reply are not pills; they belong in the request line.
- **Considered:** A fourth pill type for actions.
- **Why:** Found in the Sarah stress test: a “Signature” pill had no correct color. Actions are what to do, not facts about the email.

### D14 · Account labels mark the exception

- **Decision:** With several accounts, only items from the less common account carry a label. The coverage line shows the split.
- **Considered:** Labeling every item with its account.
- **Why:** Found in the Daniel stress test: “Work” on every row was noise.

## Lifecycle

### D15 · Done is detected, not only declared

- **Decision:** Items complete when Glance detects the action in the email app, or when the user marks them done. Done items show how they were completed and can be undone.
- **Considered:** Manual done only.
- **Why:** It makes the loop close without asking the user to report back, which is the core promise of a briefing layer.

### D16 · Nothing disappears silently

- **Decision:** Every count on screen can be opened, including Set aside. New emails arrive as an update the user adds, never reshuffling the brief.
- **Considered:** Hiding low-value email entirely; live re-ranking.
- **Why:** Users only trust a short brief when they can see what was left out.

## Process

### D17 · Prototype first, design system second

- **Decision:** Build a near-complete interactive prototype, writing rules along the way, then extract the formal design system.
- **Considered:** Designing the component library first.
- **Why:** Several rules (D13, D14) only appeared when real screens broke. A system designed before the screens would have encoded the wrong rules.

### D18 · Rules live in the repository

- **Decision:** The product brief, design rules and this log are Markdown files in the repository, read by people and AI agents alike. Changes go through pull requests.
- **Considered:** Keeping specs in Figma or a separate wiki.
- **Why:** One source of truth for humans and agents, with a history of every change.

### D19 · Demo controls are separate from the product

- **Decision:** The persona switcher and simulations live in a dark bar labeled “Demo controls · Not part of the product”.
- **Considered:** A persona switcher styled as part of the app.
- **Why:** Reviewers mistook it for an account switcher.

## Art direction

### D20 · Pastels are highlighter ink

- **Decision:** Pastel tints mark words, the way a highlighter does: yellow for money, pink for time, blue for people, purple for the evidence behind Glance’s judgments. Main surfaces stay white and gray. Sources and the original email view use these highlights instead of a purple dashed outline, and the original email has a highlighter switch.
- **Considered:** Large pastel backgrounds per section; one purple dashed outline for every source.
- **Why:** Everyone already knows what a highlighter means. It keeps color restrained, ties each fact pill’s dot to the color of its words in the email, and made the inline type labels in the email unnecessary, so the email reads without interruptions.

### D21 · The phone is the hero

- **Decision:** Sarah’s morning brief on a phone is the cover image for the project; desktop stays a full part of the product.
- **Considered:** Leading with the desktop layout.
- **Why:** A phone screen stays legible at thumbnail size, the “reading in bed before getting up” moment explains the product in one picture, and 390 px is the strictest test of “one screen, 30 seconds”.

### D22 · Show L1, L2 and L3 side by side

- **Decision:** The demo shows the same brief three ways: plain AI text, formatted text and Glance’s components.
- **Considered:** Explaining the idea in the README only.
- **Why:** The comparison makes the thesis visible in seconds. It also keeps the design honest: formatted text is a strong option, so components have to earn their place through urgency, verification and actions, not decoration.

### D23 · Everything sits on a 4 px grid, line heights included

- **Decision:** Spacing and sizes are multiples of 4, with 2 as the only half step (2, 4, 8, 12, 16, 20, 24, 32, 40, 48). Font sizes are even (12, 14, 16, 18, 20, 22, 28) and every line height is a px multiple of 4 (12/16, 14/20, 16/24, 18/24, 20/28, 28/32). Line widths, letter-spacing and documented optical nudges are exempt.
- **Considered:** Any even number (which let 6 and 10 in); even font sizes with line heights as ratios (1.45, 1.6).
- **Why:** Shuhao’s test: half of a spacing value should still be even. 6 and 10 fail it (3, 5), and centering is where halves show up, so a 4 px scale never lands on a half pixel. Ratio line heights produce values like 21.75 px and pull text off the grid even when everything else is on it. Font sizes are the exception to the halving test because a layout never halves them; their line heights carry the grid instead. The scale also becomes spacing tokens Codex can use without guessing.

### D24 · One scale, two densities

- **Decision:** Phone and desktop share one spacing scale. Desktop uses larger steps of it (gutter 32 instead of 16, greeting 32/40 instead of 28/32); it never adds new numbers. On the phone, what looks right may override the scale, but every exception is written into the rules with its reason.
- **Considered:** Strict even-number rules on desktop only, with the phone free.
- **Why:** Glance is one responsive web app, so the same component renders on both. Two rule sets would mean components switching values at breakpoints and two sets of tokens for Codex. The strict scale cost nothing on the phone: every screen still fit after the change.

### D25 · Motion explains where things came from

- **Decision:** The signature motion is a highlighter sweep across the exact source words, followed by a ring in the fact’s color. Done and snooze collapse the row and move it to the done list with Undo. Nothing else animates beyond short color changes, and reduced motion turns it all off.
- **Considered:** No motion; page-level transitions between views.
- **Why:** The sweep makes verification feel physical: you watch Glance point at the words. The collapse confirms an action without a toast. Decorative transitions would slow down a product whose promise is speed.

### D26 · The 1 / 2 / 3 switch lives in the demo controls

- **Decision:** A switch in the demo bar shows Maya’s brief as plain AI text, formatted text or Glance’s components, using the same facts.
- **Considered:** A static comparison image in the README.
- **Why:** Viewers can feel the difference themselves in a few seconds. Keeping it in the demo bar, not in the product, keeps the product honest: users would never choose a worse view.

### D27 · The request outranks the item name

- **Decision:** In the detail view the request (quote or ✦ summary) is the largest text; the item name drops one step (phone 18/24, desktop 20/28).
- **Considered:** Name and request at the same size.
- **Why:** At equal size they competed. The name is context; the request is what the user has to act on.

### D28 · Edge states say what is missing

- **Decision:** First brief, new mail, a disconnected inbox and overload each have a designed state. The disconnected state repeats the gap in the coverage line, a notice and the section header; overload shows the top 4 and “Show 8 more”.
- **Considered:** A generic error banner; letting the list grow without limit.
- **Why:** The product promise is trust. A brief that is quietly incomplete is worse than no brief, and a list that never ends breaks the “one screen, 30 seconds” promise.

### D29 · No dead controls

- **Decision:** Everything that looks pressable does something, even in the demo. “Not noise” became “Show in brief” with a working loop; “+16 more” became plain text; the Upsell signal opens its evidence.
- **Considered:** Leaving placeholders for later.
- **Why:** Reviewers click everything. A dead button reads as unfinished work, and an untraceable ✦ judgment broke our own sourcing rule.

## Back to the main line

### D30 · Scene cards in the detail view, uniform rows in the list

- **Decision:** The list keeps one uniform row so the brief scans in seconds. The detail view swaps in a scene card chosen by the email’s structure (8 types plus a text fallback). Cards hold only facts; every underlined value opens its source.
- **Considered:** One generic detail layout (quote + fact pills) for everything; scene cards in the list too.
- **Why:** An audit against the product brief showed the “components make it fast” half of the thesis had weakened: every item looked the same, so L3 differed from L2 mainly in ranking and sources. Scene cards in the list would make it noisy; in the detail they make the difference visible. Daniel’s decision email is the clearest case: two options belong side by side, not in a quote.

### D31 · One template, one data source

- **Decision:** Maya, Daniel and Sarah are generated from one template and one data file. The same data is exported to `src/data/*.json` for the app.
- **Considered:** Hand-editing a board per persona.
- **Why:** Copies drift. One source means the canvas, the mock data and the app always agree, and it mirrors how the app will work: one set of components, data per persona.

### D32 · Dark theme lives in the tokens from day one

- **Decision:** Every color token has a light and a dark value; components never choose colors themselves. A dark hero frame proves the values work.
- **Considered:** Adding dark mode later.
- **Why:** The product brief asked for both themes from the start, and retrofitting dark mode is where raw hex values get exposed. With semantic tokens it is a values change, which also makes it a good first AI pull request to review.

### D33 · Counts must add up

- **Decision:** Each brief’s email count equals Needs you + Good to know + Set aside + already done. The mock data was corrected where it didn’t (Daniel 72, Sarah 23).
- **Why:** “Complete, not just correct” is a product principle. A brief that says 23 emails and accounts for 22 is quietly wrong.

## Walking the user flows

### D34 · When every step is ticked, Mark done becomes the primary

- **Decision:** In a checklist item, ticking every step swaps the action bar: **Mark done** becomes the one primary, “Open in {app}” becomes neutral, and Snooze steps aside. A short note from the data (`scene.doneNote`) says why: “Both steps ticked. Mark it done, or keep it here until the school confirms.” Ticks alone still never mark the item done.
- **Considered:** Marking the item done automatically on the last tick; keeping “Open in {app}” as the primary.
- **Why:** Walking Sarah’s flow showed the purple button pointing back to Yahoo Mail after she had already paid and signed, so the one primary was asking for the wrong next step. Auto-done was rejected because ticks are her own notes; she may want to keep the item until the school confirms. The primary follows the person’s next step, and the decision stays hers.

### D35 · Quiet hours get an evening view

- **Decision:** During quiet hours the phone shows only the accounts the rules allow, with a calm card that says what is waiting (“12 work emails arrived after 7:00 PM. They’ll be in tomorrow’s brief at 8:00 AM.”) and a text button “Show work email anyway”.
- **Considered:** Only the rule line under the coverage text (“Quiet hours: work email hides after 7:00 PM”); hiding work email with no trace.
- **Why:** Daniel’s job ends with “when I leave work, I want work to stay at work”, but no screen showed that moment. Hiding work email silently would break “a partial brief never looks complete”; saying what is waiting keeps the brief honest and lets him stop worrying.

### D36 · User flows are the acceptance criteria

- **Decision:** Each persona has one end-to-end flow on the real screens ([User flows](user-flows.md), canvas Round 11). Every step has Given / When / Then criteria with exact copy, and issue 16 turns them into Playwright tests.
- **Considered:** Journey maps in the product brief only; per-component acceptance criteria only.
- **Why:** The design system and visual direction were complete, but no document showed a whole story from the first glance to done. Walking the stories found three states that had never been designed (D34, D35 and the phone brief after items are done). Tests that follow the same steps keep the app honest to the stories, not only to the components.

## Final review before the build

### D37 · “Move to Set aside”: the user can correct a false alarm

- **Decision:** At the end of Glance’s reasoning, a Needs you item offers “Not for you? Glance will rank emails like this lower.” and “Move to Set aside”. The item leaves Needs you, is not counted as an action or as done, appears in Set aside under “Moved by you”, and comes back with Undo or “Back to Needs you”.
- **Considered:** Leaving it undecided; a “Not important” button in the action bar; letting Done cover it.
- **Why:** A review of the whole product found the correction loop only ran one way: “Show in brief” told Glance what it missed, but nothing told it what it over-flagged. The only exits were Done, which made progress dishonest, or Snooze, which brought the item back. Placing the action in Glance’s read keeps the action bar to one primary and puts the correction where the user is already questioning the ranking.

### D38 · Every fact has a source, Good to know included

- **Decision:** Each Good to know row underlines one value (“15% discount”, “Sat, 9:00 AM”), which opens its source inline below the row. The data gives every Good to know item a `fact` with a source.
- **Considered:** Sources only for Needs you; making the whole row open the email.
- **Why:** The thesis says every fact can show the sentence it came from, but a whole section of the brief could not. The underline reuses the one affordance users already know from scene cards. Daniel’s weekly report gained a dated fact (“Search moves to Dec 8”) so it fits the time, money and people types.

### D39 · In the demo, Ask offers prepared questions only

- **Decision:** The Ask tab has no free-text input in the demo. A dashed “Demo:” note explains that answers are prepared in advance.
- **Considered:** Keeping the input and replying “try a suggested question”.
- **Why:** An input that can never answer is a dead control, and a reply that refuses typed questions feels broken. Saying so up front is honest and keeps the demo’s promise that Glance never guesses.

### D40 · The request gets two lines on desktop too

- **Decision:** In list rows, the request shows up to two lines on desktop as well as phone.
- **Considered:** One line with an ellipsis on desktop.
- **Why:** D27 made the request the most important text in the row, yet desktop cut it after a few words while the narrower phone showed it whole. The list still scans: rows stay uniform, and two lines is the cap.

### D41 · Storybook doubles as the documentation site

- **Decision:** Storybook is themed as Glance, opens on an Introduction page, has a docs page for each category, and an autodocs page for every component. It is the one place to browse the design system.
- **Considered:** A separate documentation website, like Material 3 or shadcn/ui; Storybook with its default look.
- **Why:** Public design systems are browsed as documentation sites, and the default Storybook reads as a developer tool. A separate site would double the work and the content. A themed Storybook gives the same structure for about one issue of work, and engineers recognize it. A standalone site stays possible once the app is done, with the content already written.
