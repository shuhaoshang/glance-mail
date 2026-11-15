import { useLayoutEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  applyThemePreference,
  type ThemePreference,
} from '../demo/themePreference';
import { getPersona } from '../data';
import { App } from './App';

function AccountExample({
  personaId,
}: {
  personaId: 'maya' | 'daniel' | 'sarah';
}) {
  const [choice, setChoice] = useState<ThemePreference>('system');
  useLayoutEffect(() => {
    const previous = document.documentElement.dataset.theme;
    applyThemePreference(choice);
    return () => {
      if (previous === 'light' || previous === 'dark')
        applyThemePreference(previous);
      else applyThemePreference('system');
    };
  }, [choice]);
  return (
    <App
      personaId={personaId}
      startClean
      theme={{ value: choice, onChange: setChoice }}
    />
  );
}

const meta = {
  title: 'Patterns/Account menu',
  component: AccountExample,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya' },
} satisfies Meta<typeof AccountExample>;
export default meta;
type Story = StoryObj<typeof meta>;
const open: NonNullable<Story['play']> = async ({
  args,
  canvas,
  userEvent,
}) => {
  const { name, email } = getPersona(args.personaId);
  await userEvent.click(
    canvas.getByRole('button', { name: 'Account for ' + name }),
  );
  await expect(canvas.getByRole('menu', { name: 'Account' })).toHaveTextContent(
    email,
  );
};
export const Maya: Story = { play: open };
export const Daniel: Story = { args: { personaId: 'daniel' }, play: open };
export const Sarah: Story = { args: { personaId: 'sarah' }, play: open };
export const DarkSelected: Story = {
  play: async (context) => {
    await open(context);
    await context.userEvent.click(
      context.canvas.getByRole('menuitemradio', { name: 'Dark' }),
    );
    await expect(
      context.canvas.getByRole('menuitemradio', { name: 'Dark' }),
    ).toHaveAttribute('aria-checked', 'true');
    await expect(document.documentElement).toHaveAttribute(
      'data-theme',
      'dark',
    );
  },
};
