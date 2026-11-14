import type { Item, KnowItem, OtherMailRow } from '../../../data/types';
export type EmailTab = 'Needs you' | 'Heads-up' | 'Other mail';
export type EmailOrigin =
  | { kind: 'needs-you'; item: Item }
  | { kind: 'heads-up'; item: KnowItem }
  | { kind: 'other-mail'; item: OtherMailRow };
export interface MovedRow {
  id: string;
  title: string;
  line: string;
  moved: true;
  requestType: 'quote' | 'summary';
}
export function movedRow(email: EmailOrigin): MovedRow {
  switch (email.kind) {
    case 'needs-you':
      return {
        id: email.item.id,
        title: email.item.name,
        line: email.item.request.text,
        requestType: email.item.request.type,
        moved: true,
      };
    case 'heads-up':
      return {
        id: email.item.id,
        title: email.item.title,
        line: email.item.text.replace(/^: /, ''),
        requestType: 'summary',
        moved: true,
      };
    case 'other-mail':
      return {
        id: email.item.id,
        title: email.item.sender,
        line: email.item.subject,
        requestType: 'quote',
        moved: true,
      };
  }
}
