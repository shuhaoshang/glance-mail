import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { IconButton } from './IconButton';
const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  argTypes: { disabled: { control: 'boolean' } },
  args: { icon: 'close', 'aria-label': 'Close source', onClick: fn() },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { size: 'compact' } };
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: args['aria-label'] });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
