import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SnoozeMenu } from './SnoozeMenu';
const meta = {
  title: 'Composites/SnoozeMenu',
  component: SnoozeMenu,
  args: { id: 'snooze-example', onChoose: fn(), onClose: fn() },
} satisfies Meta<typeof SnoozeMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
