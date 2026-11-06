import type { Meta, StoryObj } from '@storybook/react-vite';
import { AllDone } from './AllDone';
const meta = {
  title: 'Composites/AllDone',
  component: AllDone,
  args: { done: 4, total: 4, know: 3, aside: 31 },
} satisfies Meta<typeof AllDone>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Complete: Story = {};
export const Snoozed: Story = { args: { done: 1, snoozed: 3 } };
