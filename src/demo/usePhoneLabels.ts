import { useSyncExternalStore } from 'react';

// The pattern specification defines phone as the band below 600 pixels.
const phone =
  typeof window === 'undefined'
    ? undefined
    : window.matchMedia('(width < 600px)');
function subscribe(notify: () => void) {
  phone?.addEventListener('change', notify);
  return () => phone?.removeEventListener('change', notify);
}
export function usePhoneLabels() {
  return useSyncExternalStore(
    subscribe,
    () => phone?.matches ?? false,
    () => false,
  );
}
