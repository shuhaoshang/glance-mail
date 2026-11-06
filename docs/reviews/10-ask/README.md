# Task 10 review: Ask

Ask uses the supplied `item.qa` content only. Found answers carry the Glance label and their source; not-found answers have a dashed box without a Glance mark or source. The demo note replaces an input.

## Screenshots

Desktop: 1280 × 800, scrolled to the answer when needed. Phone: 390 × 844. Some longer answers and the demo note remain available by scrolling the sheet body above the fixed action bar.

| State | Desktop light | Desktop dark | Phone light | Phone dark |
| --- | --- | --- | --- | --- |
| maya | [Light](desktop-maya-light.jpg) | [Dark](desktop-maya-dark.jpg) | [Light](phone-maya-light.jpg) | [Dark](phone-maya-dark.jpg) |
| maya-not-found | [Light](desktop-maya-not-found-light.jpg) | [Dark](desktop-maya-not-found-dark.jpg) | [Light](phone-maya-not-found-light.jpg) | [Dark](phone-maya-not-found-dark.jpg) |
| daniel | [Light](desktop-daniel-light.jpg) | [Dark](desktop-daniel-dark.jpg) | [Light](phone-daniel-light.jpg) | [Dark](phone-daniel-dark.jpg) |
| daniel-not-found | [Light](desktop-daniel-not-found-light.jpg) | [Dark](desktop-daniel-not-found-dark.jpg) | [Light](phone-daniel-not-found-light.jpg) | [Dark](phone-daniel-not-found-dark.jpg) |
| sarah | [Light](desktop-sarah-light.jpg) | [Dark](desktop-sarah-dark.jpg) | [Light](phone-sarah-light.jpg) | [Dark](phone-sarah-dark.jpg) |
| sarah-not-found | [Light](desktop-sarah-not-found-light.jpg) | [Dark](desktop-sarah-not-found-dark.jpg) | [Light](phone-sarah-not-found-light.jpg) | [Dark](phone-sarah-not-found-dark.jpg) |

Phone action bar: [default light](phone-phone-actions-light.jpg), [default dark](phone-phone-actions-dark.jpg), [checked light](phone-checked-actions-light.jpg), [checked dark](phone-checked-actions-dark.jpg). The normal second row contains equal-width Ask, Snooze, and Done controls; after checklist completion, Open and Ask share it equally. Secondary controls remain 44 px tall, with 14/20 text and the phone prototype's compact inline padding. The primary remains 48 px.

## Validation

- Every supplied question across all three personas and every item is exercised in the AskThread All Questions story, including exact answer text and highlighted source words.
- Not-found answers contain no source highlight or Glance icon. No input, textbox, editable field, or send control is rendered.
- Used suggestions disappear, and the exhausted demo note appears after every question is used.
- Integrated persona stories check the Ask action/tab, found and not-found answers, and conversation retention when switching tabs.
- Question and answer entrances use the existing enter motion; focused answers use the shared brand focus tokens.
- TypeScript, ESLint, formatting, app/Storybook builds, and English checks pass.

## References and scope

The only Ask image present in `docs/screens/` is [desktop-maya-ask.png](../../screens/desktop-maya-ask.png). No `phone-ask.png` exists. Phone composition follows the written AskThread specification and the existing sheet; phone tab/action typography also follows the supplied phone detail prototypes.

Conversation state remains within the selected item detail, as with the existing detail states. No real AI or email request is made, and the supplied data is unchanged.

## Open questions

The specification does not define whether Ask history should survive switching items or reopening a phone sheet. It currently follows the existing detail-view lifetime and persists across tab changes. Proposed follow-up: retain asked questions per item for the demo session, including after closing the sheet. Please confirm before extending that lifetime.

In `src/data/maya.json`, Brightline's “Who else is on this thread?” is marked found but has no source. It renders the supplied answer without inventing evidence. Please provide a source or confirm that this metadata answer may omit the source.

Only `desktop-maya-ask.png` exists among the supplied Ask screenshots; phone composition follows the written specification and existing phone detail prototypes.

