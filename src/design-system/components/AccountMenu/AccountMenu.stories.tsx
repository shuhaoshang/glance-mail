import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { getPersona } from '../../../data';
import { AccountMenu } from './AccountMenu';
import type { ThemePreference } from './themeOptions';

const { name, initial, email } = getPersona('maya');
const meta = {
  title: 'Composites/AccountMenu',
  component: AccountMenu,
  parameters: { layout: 'padded' },
  args: {
    name,
    initial,
    email,
    theme: { value: 'system', onChange: () => {} },
  },
  render: function Example(args) {
    const [value, setValue] = useState<ThemePreference>(args.theme.value);
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AccountMenu {...args} theme={{ value, onChange: setValue }} />
      </div>
    );
  },
} satisfies Meta<typeof AccountMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Closed: Story = {};
export const KeyboardFocus: Story = {
  parameters: { pseudo: { focusVisible: 'button[aria-haspopup="menu"]' } },
};
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    const avatar = canvas.getByRole('button', { name: 'Account for Maya' });
    await userEvent.click(avatar);
    await expect(
      canvas.getByRole('menuitemradio', { name: 'System' }),
    ).toHaveFocus();
  },
};
export const KeyboardSelection: Story = {
  play: async (context) => {
    await Open.play?.(context);
    const { canvas, userEvent } = context;
    await userEvent.keyboard('{End}{Enter}');
    await expect(
      canvas.getByRole('menuitemradio', { name: 'Dark' }),
    ).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(
      canvas.queryByRole('menu', { name: 'Account' }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Account for Maya' }),
    ).toHaveFocus();
  },
};
