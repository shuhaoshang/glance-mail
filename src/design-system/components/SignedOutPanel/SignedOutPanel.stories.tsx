import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { SignedOutPanel } from './SignedOutPanel';

const meta = {
  title: 'Composites/SignedOutPanel',
  component: SignedOutPanel,
  args: { onSignIn: fn() },
} satisfies Meta<typeof SignedOutPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SignIn: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continue with Microsoft' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continue with Google' }),
    );
    await expect(args.onSignIn).toHaveBeenCalledTimes(2);
  },
};
