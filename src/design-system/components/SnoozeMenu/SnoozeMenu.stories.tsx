import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { SnoozeMenu } from './SnoozeMenu';
const meta = {
  title: 'Composites/SnoozeMenu',
  component: SnoozeMenu,
  args: { id: 'snooze-example', onChoose: fn(), onClose: fn() },
} satisfies Meta<typeof SnoozeMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Hover: Story = {
  parameters: { pseudo: { hover: 'button:first-of-type' } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: 'button:first-of-type' } },
};
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'button:first-of-type' } },
};
export const KeyboardChoice: Story = {
  play: async ({ canvas, args }) => {
    const choice = canvas.getByRole('button', { name: 'Tomorrow, 8:00 AM' });
    choice.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChoose).toHaveBeenCalledWith('Tomorrow, 8:00 AM');
  },
};
