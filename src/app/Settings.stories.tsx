import { useLayoutEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { getPersona, type PersonaId } from '../data';
import {
  applyThemePreference,
  type ThemePreference,
} from '../demo/themePreference';
import { DemoApp } from '../demo/DemoApp';

function SettingsExample({ personaId }: { personaId: PersonaId }) {
  const [value, onChange] = useState<ThemePreference>('system');
  useLayoutEffect(() => {
    const previous = document.documentElement.dataset.theme;
    applyThemePreference(value);
    return () =>
      applyThemePreference(
        previous === 'dark' || previous === 'light' ? previous : 'system',
      );
  }, [value]);
  return <DemoApp initialPersonaId={personaId} theme={{ value, onChange }} />;
}

const meta = {
  title: 'Patterns/Settings',
  component: SettingsExample,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya' },
} satisfies Meta<typeof SettingsExample>;
export default meta;
type Story = StoryObj<typeof meta>;

const open: NonNullable<Story['play']> = async ({
  args,
  canvas,
  userEvent,
}) => {
  await userEvent.click(
    canvas.getByRole('button', {
      name: 'Account for ' + getPersona(args.personaId).name,
    }),
  );
  await userEvent.click(canvas.getByRole('menuitem', { name: 'Settings' }));
  await expect(canvas.getByRole('heading', { name: 'Settings' })).toHaveFocus();
};
export const Maya: Story = { play: open };
export const Daniel: Story = { args: { personaId: 'daniel' }, play: open };
export const Sarah: Story = { args: { personaId: 'sarah' }, play: open };
export const DemoConfirmation: Story = {
  play: async (context) => {
    await open(context);
    await context.userEvent.click(
      context.canvas.getByRole('button', { name: 'Connect' }),
    );
    await expect(
      context.canvas.getByRole('button', { name: 'OK' }),
    ).toHaveFocus();
    await expect(
      context.canvas.getByText('This is a demo. Nothing was changed.'),
    ).toBeVisible();
  },
};
export const SignedOut: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Account for Maya' }),
    );
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Log out' }));
    await expect(
      canvas.getByRole('heading', { name: 'You’re signed out' }),
    ).toHaveFocus();
    await expect(
      canvas.getByRole('complementary', { name: 'Demo controls' }),
    ).toBeVisible();
  },
};
