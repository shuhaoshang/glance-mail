import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { getPersona } from '../../../data';
import { OtherMailRow } from './OtherMailRow';
import { MailList } from '../MailList/MailList';
const meta = {
  title: 'Composites/OtherMailRow',
  component: OtherMailRow,
  args: { item: getPersona('maya').otherMail.rows[0], onSelect: fn() },
  decorators: [
    (Story) => (
      <MailList tab="Other mail">
        <Story />
      </MailList>
    ),
  ],
} satisfies Meta<typeof OtherMailRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Hover: Story = { parameters: { pseudo: { hover: 'button' } } };
export const Pressed: Story = { parameters: { pseudo: { active: 'button' } } };
export const SelectedHover: Story = { ...Hover, args: Selected.args };
export const SelectedPressed: Story = { ...Pressed, args: Selected.args };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'button' } },
};
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    button.focus();
    await userEvent.keyboard(' ');
    await expect(args.onSelect).toHaveBeenCalledWith(args.item.id, button);
  },
};
