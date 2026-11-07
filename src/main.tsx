import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlanceDemo } from './demo/GlanceDemo';
import {
  applyThemePreference,
  readThemePreference,
} from './demo/themePreference';
import './design-system/tokens/tokens.css';
import './global.css';

const initialTheme = readThemePreference();
applyThemePreference(initialTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlanceDemo initialTheme={initialTheme} />
  </StrictMode>,
);
