import { readFileSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/design-system/docs/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
  ],
  managerHead: (head) =>
    (head ?? '') +
    '<style>' +
    readFileSync(
      new URL('../src/design-system/tokens/tokens.css', import.meta.url),
      'utf8',
    ) +
    '</style>',
  core: { disableTelemetry: true },
  async viteFinal(config) {
    return mergeConfig(config, { base: './' });
  },
};

export default config;
