import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { getPreferredColorScheme } from 'storybook/theming';
import { GlanceDocsContainer } from './GlanceDocsContainer';
import '../src/design-system/tokens/tokens.css';
import '../src/global.css';

const defaultTheme = getPreferredColorScheme();

const preview: Preview = {
  tags: ['autodocs'],
  initialGlobals: { theme: defaultTheme },
  parameters: {
    docs: { container: GlanceDocsContainer },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Overview', 'Colours', 'Type', 'Spacing', 'Radius', 'Motion'],
          'Primitives',
          ['Overview', '*'],
          'Composites',
          ['Overview', '*'],
          'Scene cards',
          ['Overview', '*'],
          'Patterns',
          ['Overview', '*'],
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme,
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
