import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../../data';
import { Person } from './Person';
const meta = {
  title: 'Primitives/Person',
  component: Person,
  parameters: { layout: 'centered' },
  args: getPersona('maya').items[0].person,
} satisfies Meta<typeof Person>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Family: Story = { args: getPersona('sarah').items[0].person };
