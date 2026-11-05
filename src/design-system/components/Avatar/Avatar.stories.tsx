import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../../data';
import { Avatar } from './Avatar';
const maya = getPersona('maya');
const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { initial: maya.initial, label: maya.name },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: 'small' } };
