# 17 · Storybook as the design system's documentation site

**Label:** `ds` · **Depends on:** 02 · **Do it right after 02**, before 03.

## Why

Public design systems such as Material 3 and shadcn/ui are documentation sites: a home page, navigation by category, and a page per component. For Glance, Storybook is that site. It is where a reviewer or a recruiter browses the system, so it should read as Glance's documentation, not as a developer tool (decision D41).

## What to build

- **Glance theme for the Storybook interface** (`.storybook/manager.ts` with `storybook/theming`): the Glance wordmark (the spark and “glance”, as in the prototypes) as the brand, linking to the live app; Inter; brand purple for selection; light and dark. Take every value from `src/design-system/tokens/tokens.css` (for example by reading the file at build time). No raw hex or px in the theme; if that is not possible, stop and say so under Open questions.
- **Introduction page** (MDX), the first page Storybook opens on. It covers:
  - what Glance is, with the thesis “Components make it fast. Sources make it trustworthy.”;
  - how the system is organised;
  - links to the live app, the prototypes (`/glance-mail/prototype/`), the repository and `docs/`.

  Use the wording of `README.md` and `docs/design-system.md` §1; do not write new product copy.

- **Sidebar order** exactly as `docs/design-system.md` §8: Introduction, Foundations, Primitives, Composites, Scene cards, Patterns. Move the scaffold placeholder out of the way; issue 06 removes it.
- **One docs page per category** (MDX), written now from the docs:
  - **Foundations:** colour meaning, the 4 px grid and type rules (`design-rules.md` §3, §10–11).
  - **Primitives** and **Composites:** what each component is for, from `design-system.md` §3–4.
  - **Scene cards:** the “use when the email…” table and the selection rules (`design-system.md` §5).
  - **Patterns:** the patterns table (`design-system.md` §6).

  Quote or link the rules; do not reword them.

- **Autodocs for every component:** set `tags: ['autodocs']` in `.storybook/preview.ts`, so every component added by later issues gets a page with its props table and all its stories.
- Light and dark apply to the docs pages as well as the stories.

## Acceptance criteria

- [ ] `/glance-mail/storybook/` opens on Introduction, branded as Glance, not the default Storybook look.
- [ ] The sidebar follows `design-system.md` §8, with a docs page at the top of each category.
- [ ] Every rule on a docs page matches `design-rules.md` or `design-system.md` word for word, or links to it.
- [ ] No raw hex or px values outside `tokens.css`, including the Storybook theme.
- [ ] Light and dark both work on docs pages.
- [ ] English only. PR description follows `AGENTS.md` (What, Why, Design system impact, Screenshots, How to review, Open questions).

## References

`docs/design-system.md` §1 and §8, `docs/design-rules.md`, `docs/decisions.md` D41, `docs/screens/ds-foundations.png`, `docs/screens/ds-components.png`

## Out of scope

A separate documentation website outside Storybook (possible after the app is done); custom search.
