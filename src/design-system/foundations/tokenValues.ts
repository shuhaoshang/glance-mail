import { useSyncExternalStore, type RefObject } from 'react';
import tokenSource from '../tokens/tokens.css?raw';

export const tokenNames = [
  ...new Set(
    Array.from(tokenSource.matchAll(/(--[\w-]+)\s*:/g), (match) => match[1]),
  ),
];

function subscribeToTokenChanges(update: () => void) {
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const preferences = [
    '(prefers-color-scheme: dark)',
    '(prefers-reduced-motion: reduce)',
  ].map((query) => window.matchMedia(query));
  preferences.forEach((query) => query.addEventListener('change', update));
  window.addEventListener('resize', update);
  return () => {
    observer.disconnect();
    preferences.forEach((query) => query.removeEventListener('change', update));
    window.removeEventListener('resize', update);
  };
}

export function useTokenValues(
  names: readonly string[],
  scope?: RefObject<HTMLElement | null>,
) {
  const snapshot = useSyncExternalStore(
    subscribeToTokenChanges,
    () => {
      const style = getComputedStyle(
        scope?.current ?? document.documentElement,
      );
      return names
        .map((name) => style.getPropertyValue(name).trim())
        .join('\0');
    },
    () => '',
  );
  return Object.fromEntries(
    snapshot.split('\0').map((value, i) => [names[i], value]),
  );
}
