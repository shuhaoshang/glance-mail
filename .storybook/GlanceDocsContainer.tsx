import { useMemo, useSyncExternalStore, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { getGlanceTheme, resolveGlanceMode } from './glanceTheme';

function subscribe(update: () => void) {
  const channel = addons.getChannel();
  channel.on(GLOBALS_UPDATED, update);
  return () => channel.off(GLOBALS_UPDATED, update);
}

function selectedTheme() {
  const theme = addons.getChannel().last(GLOBALS_UPDATED)?.[0]?.globals?.theme;
  return resolveGlanceMode(theme);
}

export function GlanceDocsContainer(
  props: ComponentProps<typeof DocsContainer>,
) {
  const mode = useSyncExternalStore(subscribe, selectedTheme);
  const theme = useMemo(() => getGlanceTheme(mode), [mode]);

  return <DocsContainer {...props} theme={theme} />;
}
