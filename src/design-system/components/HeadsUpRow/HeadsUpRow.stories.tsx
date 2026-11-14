import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { getPersona } from '../../../data';
import { HeadsUpRow } from './HeadsUpRow';
import { MailList } from '../MailList/MailList';
const maya = getPersona('maya'),
  daniel = getPersona('daniel');
const meta = {
  title: 'Composites/HeadsUpRow',
  component: HeadsUpRow,
  args: { item: maya.goodToKnow[0], onSelect: fn() },
  decorators: [
    (Story) => (
      <MailList tab="Heads-up">
        <Story />
      </MailList>
    ),
  ],
} satisfies Meta<typeof HeadsUpRow>;
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
export const Personal: Story = {
  args: {
    item: daniel.goodToKnow[2],
    account: daniel.accounts.find((a) => a.id === daniel.goodToKnow[2].account),
  },
};
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith(args.item.id, button);
    await expect(canvas.queryByRole('mark')).not.toBeInTheDocument();
  },
};
