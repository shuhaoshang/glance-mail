import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { getPersona } from '../../../data';
import { MemoryPanel } from './MemoryPanel';

const meta = {
  title: 'Composites/MemoryPanel',
  component: MemoryPanel,
  args: {
    memory: getPersona('maya').memory,
    onAdd: fn(),
    onEdit: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof MemoryPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Maya: Story = {};
export const EmptySections: Story = {
  args: { memory: { instructions: [], learned: [] } },
};
