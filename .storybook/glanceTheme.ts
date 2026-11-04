import { create, getPreferredColorScheme } from 'storybook/theming';

export type GlanceMode = 'light' | 'dark';

export function resolveGlanceMode(value: unknown): GlanceMode {
  return value === 'light' || value === 'dark'
    ? value
    : getPreferredColorScheme();
}

const wordmark = `<span class="glance-wordmark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12.6 7.5 16.5 11.4 22 12C16.5 12.6 12.6 16.5 12 22C11.4 16.5 7.5 12.6 2 12C7.5 11.4 11.4 7.5 12 2Z"/></svg>glance</span>`;

// Storybook needs resolved colors for its color calculations and numeric radii.
export function getGlanceTheme(mode: GlanceMode) {
  const root = document.documentElement;
  if (root.dataset.theme !== mode) root.dataset.theme = mode;

  const styles = getComputedStyle(root);
  function token(name: string) {
    const value = styles.getPropertyValue(name).trim();
    if (!value) throw new Error(`Missing Glance theme token: ${name}`);
    return value;
  }

  return create({
    base: mode,
    brandTitle: wordmark,
    brandUrl: 'https://shuhaoshang.github.io/glance-mail/',
    fontBase: token('--font-family'),
    colorPrimary: token('--color-brand'),
    colorSecondary: token('--color-brand'),
    appBg: token('--color-bg'),
    appContentBg: token('--color-surface'),
    appPreviewBg: token('--color-bg'),
    appHoverBg: token('--color-surface-muted'),
    appBorderColor: token('--color-border'),
    appBorderRadius: Number.parseFloat(token('--radius-panel')),
    textColor: token('--color-text'),
    textInverseColor: token('--color-on-brand'),
    textMutedColor: token('--color-text-muted'),
    barTextColor: token('--color-text-secondary'),
    barHoverColor: token('--color-brand-text'),
    barSelectedColor: token('--color-brand-text'),
    barBg: token('--color-surface'),
    buttonBg: token('--color-surface'),
    buttonBorder: token('--color-border-strong'),
    booleanBg: token('--color-surface-sunken'),
    booleanSelectedBg: token('--color-brand'),
    inputBg: token('--color-surface'),
    inputBorder: token('--color-border-strong'),
    inputTextColor: token('--color-text'),
    inputBorderRadius: Number.parseFloat(token('--radius-tile')),
    gridCellSize: Number.parseFloat(token('--space-4')),
  });
}
