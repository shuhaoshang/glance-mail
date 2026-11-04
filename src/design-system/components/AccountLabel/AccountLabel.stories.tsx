import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../../data';
import { AccountLabel } from './AccountLabel';

const meta = {
  title: 'Primitives/AccountLabel',
  component: AccountLabel,
  parameters: { layout: 'centered' },
  args: { account: getPersona('sarah').accounts[1] },
} satisfies Meta<typeof AccountLabel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Minority: Story = {};
export const UsualInbox: Story = {
  args: { account: getPersona('sarah').accounts[0] },
  render: (args) => (
    <span>
      {getPersona('sarah').accounts[0].app} <AccountLabel {...args} />
    </span>
  ),
};
