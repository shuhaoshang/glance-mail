import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, fn } from 'storybook/test';
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

export const ReviewSetAside: Story = { args: { onReviewAside: fn() } };

export const TabbedComplete: Story = {
  args: { wording: 'tabs' },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByText(
          '4 of 4 actions done. 3 emails in Heads-up and 31 in Other mail.',
          { exact: true },
        ),
      ).toBeVisible(),
    );
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};
export const TabbedSnoozed: Story = {
  args: { wording: 'tabs', done: 1, snoozed: 3 },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByText(
          '1 of 4 actions done. 3 snoozed items will come back later. 3 emails in Heads-up and 31 in Other mail.',
          { exact: true },
        ),
      ).toBeVisible(),
    );
  },
};
