import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';
import { getGlanceTheme, resolveGlanceMode } from './glanceTheme';

const urlGlobals = new URLSearchParams(window.location.search).get('globals');
const urlTheme = urlGlobals?.match(/(?:^|;)theme:(light|dark)(?:;|$)/)?.[1];
let mode = resolveGlanceMode(urlTheme);

addons.setConfig({ theme: getGlanceTheme(mode) });
addons.register('glance/theme', (api) => {
  function syncTheme({ globals }: { globals: { theme?: string } }) {
    const next = resolveGlanceMode(globals.theme);
    if (next === mode) return;
    mode = next;
    addons.setConfig({ theme: getGlanceTheme(mode) });
  }

  api.on(SET_GLOBALS, syncTheme);
  api.on(GLOBALS_UPDATED, syncTheme);
});
