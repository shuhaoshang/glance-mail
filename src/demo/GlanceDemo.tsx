import { useState } from 'react';
import { DemoApp } from './DemoApp';
import {
  applyThemePreference,
  saveThemePreference,
  type ThemePreference,
} from './themePreference';

export function GlanceDemo({
  initialTheme,
}: {
  initialTheme: ThemePreference;
}) {
  const [theme, setTheme] = useState(initialTheme);
  return (
    <DemoApp
      syncUrl
      theme={{
        value: theme,
        onChange: (next) => {
          applyThemePreference(next);
          saveThemePreference(next);
          setTheme(next);
        },
      }}
    />
  );
}
