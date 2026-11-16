import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { getPersona } from '../../../data';
import type { ThemePreference } from '../AccountMenu/themeOptions';
import { SettingsPanel } from './SettingsPanel';
import { defaultSettings } from './preferences';

const meta = {
  title: 'Composites/SettingsPanel',
  component: SettingsPanel,
  parameters: { layout: 'padded' },
  args: {
    persona: getPersona('maya'),
    preferences: defaultSettings(false),
    onPreferencesChange: fn(),
    theme: { value: 'system', onChange: fn() },
    entry: {},
    onBack: fn(),
    onLogout: fn(),
  },
  render: function Example(args) {
    const [preferences, onPreferencesChange] = useState(args.preferences);
    const [value, onChange] = useState<ThemePreference>(args.theme.value);
    return (
      <SettingsPanel
        {...args}
        preferences={preferences}
        onPreferencesChange={onPreferencesChange}
        theme={{ value, onChange }}
      />
    );
  },
} satisfies Meta<typeof SettingsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Maya: Story = {};
export const Daniel: Story = {
  args: { persona: getPersona('daniel'), preferences: defaultSettings(true) },
};
export const Sarah: Story = { args: { persona: getPersona('sarah') } };
