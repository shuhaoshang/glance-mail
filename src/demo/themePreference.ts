export const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

export type ThemePreference = (typeof themeOptions)[number]['value'];

export interface ThemeControl {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

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
