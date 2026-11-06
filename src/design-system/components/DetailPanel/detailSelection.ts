import type { Item } from '../../../data/types';
export const inboxUrls = {
  Gmail: 'https://mail.google.com/',
  Outlook: 'https://outlook.office.com/mail/',
  'Yahoo Mail': 'https://mail.yahoo.com/',
};
export function firstFieldForFact(item: Item, factId?: string) {
  if (!factId) return undefined;
  const scene = item.scene;
  const index = (fields: { fact?: string }[], prefix: string) => {
    const i = fields.findIndex((field) => field.fact === factId);
    return i < 0 ? undefined : prefix + i;
  };
  switch (scene?.type) {
    case 'deal':
      return index(scene.fields, 'fields.');
    case 'decision':
      return index(scene.options, 'options.');
    case 'approval':
    case 'payment':
      return scene.amount.fact === factId
        ? 'amount'
        : index(scene.fields, 'fields.');
    case 'mismatch':
      return index(scene.compare, 'compare.') ?? index(scene.fields, 'fields.');
    case 'event':
      return scene.main.fact === factId
        ? 'main'
        : index(scene.fields, 'fields.');
    case 'range':
      return index(scene.fields, 'fields.');
    case 'checklist':
      return index(scene.steps, 'steps.') ?? index(scene.fields, 'fields.');
    default:
      return 'facts.' + factId;
  }
}
