export type Destination = 'needs-you' | 'heads-up' | 'other-mail';
export const destinations = [
  { id: 'needs-you', label: 'Needs you', description: 'You need to act' },
  { id: 'heads-up', label: 'Heads-up', description: 'No action needed' },
  { id: 'other-mail', label: 'Other mail', description: 'Not for you' },
] as const;
