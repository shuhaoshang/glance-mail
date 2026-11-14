import type { ToastMessage } from './Toast';
export const toastSamples = {
  move: {
    title: 'Moved to Heads-up.',
    description: 'Glance will sort emails like this into Heads-up.',
  },
  watchlist: {
    title: 'Added to Watchlist.',
    description: 'Emails about it will go to the top.',
  },
  saved: { title: 'Saved.' },
  memory: {
    title: 'Saved as your instruction.',
    description: 'Glance follows it from the next email.',
  },
} satisfies Record<string, ToastMessage>;
export type ToastSample = keyof typeof toastSamples;
