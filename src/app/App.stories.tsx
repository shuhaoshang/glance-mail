import type { Meta, StoryObj } from '@storybook/react-vite';
import { App } from './App';

const meta = {
  title: 'Scaffold/Placeholder',
  component: App,
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya' },
  argTypes: {
    personaId: { control: 'select', options: ['maya', 'daniel', 'sarah'] },
  },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Maya: Story = {};
export const Daniel: Story = { args: { personaId: 'daniel' } };
export const Sarah: Story = { args: { personaId: 'sarah' } };
