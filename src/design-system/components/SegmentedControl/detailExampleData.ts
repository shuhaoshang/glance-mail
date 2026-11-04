import { getPersona } from '../../../data';

export const itemViews = [
  { value: 'details', label: 'Details', panelId: 'details-panel' },
  { value: 'email', label: 'Original email', panelId: 'email-panel' },
  { value: 'ask', label: 'Ask', panelId: 'ask-panel' },
];

const item = getPersona('maya').items[0];
export const samples: Record<string, string> = {
  details: item.request.text,
  email: item.email.subject,
  ask: item.qa[0].q,
};
