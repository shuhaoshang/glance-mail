import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { AllDone } from './AllDone';
const meta = {
  title: 'Composites/AllDone',
  component: AllDone,
  args: { done: 4, total: 4, know: 3, aside: 31 },
} satisfies Meta<typeof AllDone>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Complete: Story = {
  play: async ({ canvas }) => {
    await waitFor(async () => {
      await expect(
        canvas.getByRole('heading', { name: 'Nothing else needs you today' }),
      ).toBeVisible();
    });
  },
};
export const Snoozed: Story = {
  args: { done: 1, snoozed: 3 },
  play: async ({ canvas }) => {
    await waitFor(async () => {
      await expect(
        canvas.getByRole('heading', {
          name: 'Nothing else needs you right now',
        }),
      ).toBeVisible();
    });
  },
};
