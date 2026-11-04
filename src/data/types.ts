export type PersonaId = 'maya' | 'daniel' | 'sarah';

export type FactKind = 'money' | 'time' | 'people';
export type InkKind = FactKind | 'judg'; // 'judg' = evidence behind Glance's read (purple ink)

export interface Persona {
  version: 1;
  id: PersonaId;
  name: string; // "Maya"
  role: string; // "Sales"
  initial: string; // avatar letter
  date: string; // "Thursday, November 5" (the demo's fixed "today")
  greeting: string; // "Good morning, Maya"
  coverage: {
    emails: number; // emails covered by this brief
    text: string; // "{n} emails overnight, all in Outlook." ({n} is replaced)
    note: string | null; // per-account rule, e.g. quiet hours
  };
  accounts: Account[];
  doneBefore: { name: string; note: string }[]; // items already done when the brief opens
  newMail: NewMail | null; // mail that arrives while reading (Maya only)
  items: Item[]; // Needs you, already ranked: urgency first, then value
  goodToKnow: KnowItem[];
  setAside: SetAsideGroup[];
  demo: Demo; // demo-only content, not product data
}

export interface Account {
  id: string;
  app: 'Outlook' | 'Gmail' | 'Yahoo Mail';
  label: string | null; // "Work", "Family"
  minority?: boolean; // true = the less common inbox; only its items show an AccountLabel
}

export interface Item {
  id: string;
  name: string; // sender organization or topic, e.g. "Fernway Logistics"
  account: string; // Account.id
  isNew?: boolean; // arrives with newMail; hidden until "Add to brief"
  person: { name: string; role: string; initial: string };
  request: {
    type: 'quote' | 'summary'; // quote = verbatim (in “ ”); summary = Glance's words (✦)
    by: string; // "Priya asks"; empty for summaries
    text: string;
  };
  rank: string; // why it is ranked here (Glance's words, shown on request)
  from: string; // source sender
  when: string; // source date, e.g. "Wed, Nov 4, 9:12 AM"
  facts: Fact[]; // the first two become list chips; urgent first
  scene: Scene; // detail layout, see design-system.md §5
  judgments: Judgment[]; // Glance's read, each optionally with evidence
  email: { subject: string; from: string; paras: Segment[][] };
  qa: QA[]; // pre-written Ask answers
}

export interface Fact {
  id: string; // "f1"; referenced by scene fields
  kind: FactKind;
  label: string; // chip label, e.g. "Due Fri · tomorrow"
  urgent: boolean; // due today/tomorrow, overdue, or someone waiting ≥ 2 days
  source: { pre: string; hl: string; post: string }; // the sentence, with the exact words in hl
}

export type Segment = string | { t: string; kind: InkKind; tag: string }; // tag = hover label, e.g. "Money · $12 fee"

export interface Judgment {
  label: string; // "Renewal risk"
  why: string;
  source: {
    from: string;
    when: string;
    pre: string;
    hl: string;
    post: string;
  } | null;
}

export interface QA {
  q: string;
  found: boolean; // false renders "Not in your email"
  a: string;
  source?: {
    from: string;
    when: string;
    pre: string;
    hl: string;
    post: string;
  };
}

// A Field shows a value; with `fact` it is tappable and opens that fact's source.
export interface FieldSpec {
  label?: string;
  value: string;
  fact?: string;
}

export type Scene =
  | { type: 'deal'; label: string; urgent: string | null; fields: FieldSpec[] }
  | {
      type: 'decision';
      label: string;
      urgent: string | null;
      options: { key: string; title: string; value: string; fact?: string }[];
    }
  | {
      type: 'approval' | 'payment';
      label: string;
      urgent: string | null;
      amount: FieldSpec;
      fields: FieldSpec[];
      note?: string;
    }
  | {
      type: 'mismatch';
      label: string;
      urgent: string | null;
      compare: FieldSpec[];
      fields: FieldSpec[];
    }
  | {
      type: 'event';
      label: string;
      urgent: string | null;
      tile: DateParts;
      main: FieldSpec;
      title: string;
      fields: FieldSpec[];
    }
  | {
      type: 'range';
      label: string;
      urgent: string | null;
      from: DateParts;
      to: DateParts;
      fields: FieldSpec[];
    }
  | {
      type: 'checklist';
      label: string;
      urgent: string | null;
      steps: { pre: string; value?: string; fact?: string }[];
      fields: FieldSpec[];
      doneNote?: string;
    } // doneNote: shown when every step is ticked
  | { type: 'text' }; // no card: render the facts as an underlined list

export interface DateParts {
  month: string;
  day: string;
  weekday?: string;
}

export interface KnowItem {
  icon: 'tag' | 'clock' | 'people' | 'chart' | 'package' | 'mail';
  tone: FactKind | 'neutral';
  title: string;
  text: string; // starts with ": " or " " so it reads after the bold title
  account?: string; // Account.id; shown only if that account is the minority
  fact: {
    value: string;
    kind: FactKind;
    source: {
      from: string;
      when: string;
      pre: string;
      hl: string;
      post: string;
    };
  };
  // value appears exactly once in text; it is underlined and opens the source
  judgment?: {
    label: string;
    read: string;
    source: {
      from: string;
      when: string;
      pre: string;
      hl: string;
      post: string;
    };
  };
}

export interface SetAsideGroup {
  title: string; // "Newsletters"
  short: string; // "newsletters" (used in the summary line)
  count: number; // total in the group, including rows not listed
  rows: { id: string; title: string; sub: string; isNew?: boolean }[];
}

export interface NewMail {
  label: string;
  added: string;
  emails: number;
}

export interface Demo {
  simulate: {
    item: string;
    who: string;
    label: string;
    detected: string;
    already: string;
    note: string;
  }; // label: “Simulate reply to Priya”
  levels: {
    l1: string;
    l2: {
      needs: [string, string][];
      know: string[];
      done: string[];
      setAside: string;
    };
  };
  initialSelection: {
    itemIndex: number;
    openFactIndex: number;
    reasonOpen: boolean;
  };
}
