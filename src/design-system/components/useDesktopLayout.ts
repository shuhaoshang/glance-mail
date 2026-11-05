import { useSyncExternalStore } from 'react';
import sheet from '../tokens/tokens.css?raw';

const condition = sheet
  .match(/@media\s+([^{]+)\{\s*:root\s*\{[^}]*--gutter\s*:/)?.[1]
  .trim();
if (!condition) throw new Error('Missing desktop token breakpoint.');
const query =
  typeof window === 'undefined' ? undefined : window.matchMedia(condition);
function subscribe(notify: () => void) {
  query?.addEventListener('change', notify);
  return () => query?.removeEventListener('change', notify);
}
export function useDesktopLayout() {
  return useSyncExternalStore(
    subscribe,
    () => query?.matches ?? false,
    () => false,
  );
}
