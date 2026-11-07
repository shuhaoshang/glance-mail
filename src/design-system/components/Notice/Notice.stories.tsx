import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Notice } from './Notice';

const meta = {
  title: 'Composites/Notice',
  component: Notice,
  parameters: { layout: 'padded' },
  args: {
    icon: 'link-off',
    title: 'Yahoo Mail (Family) is disconnected',
    body: 'This brief only covers Gmail. School and family emails since 6:00 PM yesterday aren’t in it.',
  },
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reconnect: Story = {
  args: {
    action: { label: 'Reconnect Yahoo Mail', onClick: fn() },
  },
};

export const KeyboardAction: Story = {
  args: {
    action: { label: 'Reconnect Yahoo Mail', onClick: fn() },
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Reconnect Yahoo Mail' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.action?.onClick).toHaveBeenCalledTimes(1);
  },
};
