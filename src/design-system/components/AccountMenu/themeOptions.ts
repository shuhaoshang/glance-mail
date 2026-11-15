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
