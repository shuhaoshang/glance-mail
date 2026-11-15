import type { ThemePreference } from '../design-system/components/AccountMenu/themeOptions';
export type { ThemePreference } from '../design-system/components/AccountMenu/themeOptions';

// Keep this key in sync with the pre-paint script in index.html.
const storageKey = 'glance-theme';

export function readThemePreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage may be blocked. The system palette is still available.
  }
  return 'system';
}

export function applyThemePreference(value: ThemePreference) {
  const root = document.documentElement;
  if (value === 'system') delete root.dataset.theme;
  else root.dataset.theme = value;
}

export function saveThemePreference(value: ThemePreference) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // The current view still uses the viewer's choice for this page.
  }
}
