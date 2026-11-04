# 04 · Fact primitives: FactChip, Field, Highlight and SourcePanel

**Label:** `ds` · **Depends on:** 03

## Why
These carry the thesis: facts you can scan and check in one click.

## What to build
- `FactChip` (money, time, people; urgent = solid pink with white dot).
- `Field` (label, value, size small/default/large, optional `fact`; dotted underline in the type color when it has a source; inked when selected; plain text and not focusable without a source).
- `Highlight` (money, time, people, judgment ink; selected ring; sweep animation; ink continues across wrapped lines).
- `SourcePanel` (header with sender and date, Open email, close; the sentence with the highlighted words; entrance: fade, sweep, ring).

## Acceptance criteria
- [ ] Field `aria-label` reads “{label}: {value}. Show where the email says so” when it has a source.
- [ ] With reduced motion the sweep and ring appear instantly.
- [ ] Stories use real facts from `src/data/` and work in both themes.
- [ ] PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References
`docs/design-system.md` §3, `docs/design-rules.md` §3–5

## Out of scope
Scene cards (issue 07).
