# Glance data model

The mock data lives in `src/data/maya.json`, `daniel.json` and `sarah.json`. All three files come from the same source as the design prototypes, so the screens and the data always match.

> **Version 2.** Visual 2.0 adds Other mail, Watchlist and Memory to the data. Section “Version 2” at the end lists the changes; where it disagrees with the text above, it wins.

The data is designer-owned content:
- Change it through a pull request.
- Don't rewrite the copy, especially quotes. A quote is the sender's exact words.

This page describes the shape so it can be typed in TypeScript (`src/data/types.ts`).

## Types

```ts
type FactKind = 'money' | 'time' | 'people';
type InkKind = FactKind | 'judg'; // 'judg' = evidence behind Glance's read (purple ink)

interface Persona {
  version: 1;
  id: 'maya' | 'daniel' | 'sarah';
  name: string;              // "Maya"
  role: string;              // "Sales"
  initial: string;           // avatar letter
  date: string;              // "Thursday, November 5" (the demo's fixed "today")
  greeting: string;          // "Good morning, Maya"
  coverage: {
    emails: number;          // emails covered by this brief
    text: string;            // "{n} emails overnight, all in Outlook." ({n} is replaced)
    note: string | null;     // per-account rule, e.g. quiet hours
  };
  accounts: Account[];
  doneBefore: { name: string; note: string }[];   // items already done when the brief opens
  newMail: NewMail | null;   // mail that arrives while reading (Maya only)
  items: Item[];             // Needs you, already ranked: urgency first, then value
  goodToKnow: KnowItem[];
  setAside: SetAsideGroup[];
  demo: Demo;                // demo-only content, not product data
}

interface Account {
  id: string;
  app: 'Outlook' | 'Gmail' | 'Yahoo Mail';
  label: string | null;      // "Work", "Family"
  minority?: boolean;        // true = the less common inbox; only its items show an AccountLabel
}

interface Item {
  id: string;
  name: string;              // sender organization or topic, e.g. "Fernway Logistics"
  account: string;           // Account.id
  isNew?: boolean;           // arrives with newMail; hidden until "Add to brief"
  person: { name: string; role: string; initial: string };
  request: {
    type: 'quote' | 'summary';   // quote = verbatim (in “ ”); summary = Glance's words (✦)
    by: string;                  // "Priya asks"; empty for summaries
    text: string;
  };
  rank: string;              // why it is ranked here (Glance's words, shown on request)
  from: string;              // source sender
  when: string;              // source date, e.g. "Wed, Nov 4, 9:12 AM"
  facts: Fact[];             // the first two become list chips; urgent first
  scene: Scene;              // detail layout, see design-system.md §5
  judgments: Judgment[];     // Glance's read, each optionally with evidence
  email: { subject: string; from: string; paras: Segment[][] };
  qa: QA[];                  // pre-written Ask answers
}

interface Fact {
  id: string;                // "f1"; referenced by scene fields
  kind: FactKind;
  label: string;             // chip label, e.g. "Due Fri · tomorrow"
  urgent: boolean;           // due today/tomorrow, overdue, or someone waiting ≥ 2 days
  source: { pre: string; hl: string; post: string };  // the sentence, with the exact words in hl
}

type Segment = string | { t: string; kind: InkKind; tag: string };  // tag = hover label, e.g. "Money · $12 fee"

interface Judgment {
  label: string;             // "Renewal risk"
  why: string;
  source: { from: string; when: string; pre: string; hl: string; post: string } | null;
}

interface QA {
  q: string;
  found: boolean;            // false renders "Not in your email"
  a: string;
  source?: { from: string; when: string; pre: string; hl: string; post: string };
}

// A Field shows a value; with `fact` it is tappable and opens that fact's source.
interface FieldSpec { label?: string; value: string; fact?: string }

type Scene =
  | { type: 'deal'; label: string; urgent: string | null; fields: FieldSpec[] }
  | { type: 'decision'; label: string; urgent: string | null; options: { key: string; title: string; value: string; fact?: string }[] }
  | { type: 'approval' | 'payment'; label: string; urgent: string | null; amount: FieldSpec; fields: FieldSpec[]; note?: string }
  | { type: 'mismatch'; label: string; urgent: string | null; compare: FieldSpec[]; fields: FieldSpec[] }
  | { type: 'event'; label: string; urgent: string | null; tile: DateParts; main: FieldSpec; title: string; fields: FieldSpec[] }
  | { type: 'range'; label: string; urgent: string | null; from: DateParts; to: DateParts; fields: FieldSpec[] }
  | { type: 'checklist'; label: string; urgent: string | null; steps: { pre: string; value?: string; fact?: string }[]; fields: FieldSpec[]; doneNote?: string }  // doneNote: shown when every step is ticked
  | { type: 'text' };        // no card: render the facts as an underlined list

interface DateParts { month: string; day: string; weekday?: string }

interface KnowItem {
  icon: 'tag' | 'clock' | 'people' | 'chart' | 'package' | 'mail';
  tone: FactKind | 'neutral';
  title: string;
  text: string;              // starts with ": " or " " so it reads after the bold title
  account?: string;          // Account.id; shown only if that account is the minority
  fact: { value: string; kind: FactKind; source: { from: string; when: string; pre: string; hl: string; post: string } };
                             // value appears exactly once in text; it is underlined and opens the source
  judgment?: { label: string; read: string; source: { from: string; when: string; pre: string; hl: string; post: string } };
}

interface SetAsideGroup {
  title: string;             // "Newsletters"
  short: string;             // "newsletters" (used in the summary line)
  count: number;             // total in the group, including rows not listed
  rows: { id: string; title: string; sub: string; isNew?: boolean }[];
}

interface NewMail { label: string; added: string; emails: number }

interface Demo {
  simulate: { item: string; who: string; label: string; detected: string; already: string; note: string };  // label: “Simulate reply to Priya”
  levels: { l1: string; l2: { needs: [string, string][]; know: string[]; done: string[]; setAside: string } };
  initialSelection: { itemIndex: number; openFactIndex: number; reasonOpen: boolean };
}
```

## Rules the data follows

- **Items are pre-ranked.** Render them in array order and number them 1…n. Do not re-sort in the UI.
- **Urgency is data, not logic.** A fact marked `urgent` renders as a solid chip, and urgent facts come first in `facts`.
- **Quotes are verbatim.** If a quote needs to change, the email in `email.paras` must change with it.
- **Every `fact` referenced by a scene field exists in `facts`.** Fields without `fact` are plain text and not tappable.
- **Every Good to know item has a `fact`,** and `fact.value` appears exactly once in its `text`.
- **Counts add up.**
  - `coverage.emails` = the items, `goodToKnow`, `setAside` counts and done items for that morning.
  - When the user adds `newMail`, `coverage.emails` grows by `newMail.emails`.
- **Dates are US format** (“Thu, Nov 5”, “3:30 PM”). The demo's “today” is Thursday, November 5, 2026.

---

## Version 2

The persona files move to `"version": 2`. The files and `types.ts` are provided by design in `docs/handoff/v2/provided/`.

A Heads-up or Other mail email without an `account` belongs to the persona's main account: the account not marked `minority`. Resolve and pass this account to DetailPanel when wiring the app. No account fields need to be added to the supplied data.

```ts
interface Persona {
  version: 2;
  email: string;            // shown in the account menu, e.g. "maya@example.com"
  goodToKnow: KnowItem[];   // shown as the Heads-up tab; the key keeps its name
  otherMail: OtherMail;     // the Other mail tab
  watchlist: WatchItem[];
  memory: { instructions: MemoryNote[]; learned: MemoryNote[] };
  setAside: SetAsideGroup[]; // deprecated; removed with the old view in the last issue
  // everything else as in version 1
}

interface Item {
  watch?: string;           // WatchItem.id: “Based on Watchlist: …” in Glance's reasoning
}

interface KnowItem {
  id: string;               // "h1"
  summary: string;          // the detail headline, Glance's words
  email: { subject: string; from: string; paras: Segment[][] }; // date: fact.source.when
  watch?: string;           // WatchItem.id: “Part of Watchlist: …”
}

interface OtherMail {
  total: number;            // every email sorted here; `rows` lists only some
  rows: OtherMailRow[];
}

interface OtherMailRow {
  id: string;
  sender: string;
  subject: string;
  when: string;
  reason: string;           // why it is here, Glance's words
  basis: 'instruction' | 'learned' | null; // tag: "Your instruction" / "Learned"
  isNew?: boolean;          // arrives with newMail
  paras: Segment[][];       // the body; 'judg' segments mark what Glance used
}

interface WatchItem {
  id: string;
  name: string;
  status: string;
  news: number;             // new emails about it in this brief
  item?: string;            // Item.id or KnowItem.id that “N new” opens
}

interface MemoryNote {
  id: string;
  text: string;
  meta: string;             // "Added Oct 28" · "From 4 opens · Oct 20"
}
```

`demo.levels.l2.setAside` is renamed `otherMail`.

Rules, enforced by `npm run check:data`:

- `coverage.emails` = items not marked `isNew` + `goodToKnow` + `otherMail.total` + `doneBefore`.
- `otherMail.total` is at least the number of rows not marked `isNew`.
- Every `watch` names a `watchlist` id. Every `WatchItem.item` names an `items` or `goodToKnow` id, and is present exactly when `news` is greater than 0.
- A KnowItem's source sentence (`pre` + `hl` + `post`) appears in its `email`.
- Every OtherMailRow has at least one `judg` segment.
- Ids are unique within a persona across `items`, `goodToKnow` and `otherMail.rows`.
