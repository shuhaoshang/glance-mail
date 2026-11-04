import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlanceMark } from './GlanceMark';
const meta = {
  title: 'Primitives/GlanceMark',
  component: GlanceMark,
  parameters: { layout: 'centered' },
  args: { showLabel: true },
} satisfies Meta<typeof GlanceMark>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WithLabel: Story = {};
export const MarkOnly: Story = { args: { showLabel: false } };
