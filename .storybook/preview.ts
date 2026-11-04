import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/design-system/tokens/tokens.css';
import '../src/global.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colours', 'Type', 'Spacing', 'Radius', 'Motion', 'Icons'],
          'Scaffold',
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
