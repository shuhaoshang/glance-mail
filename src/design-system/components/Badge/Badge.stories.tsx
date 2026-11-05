import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Badge>;
export default meta;
export const New: StoryObj<typeof meta> = {};
