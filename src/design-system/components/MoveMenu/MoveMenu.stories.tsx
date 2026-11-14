import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MoveMenuExample } from './MoveMenuExample';
const meta = {
  title: 'Composites/MoveMenu',
  component: MoveMenuExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false },
      description: {
        component:
          'The three-destination menu blocks the current destination. Opening focuses the first enabled item. Arrow keys, Home/End, Escape, Tab exit, and outside-click dismissal work without moving any email. The trigger and action-bar elements provide its measured anchor and phone width.',
      },
    },
  },
  args: { current: 'needs-you', onChoose: fn() },
} satisfies Meta<typeof MoveMenuExample>;
export default meta;
type Story = StoryObj<typeof meta>;
const open: Story['play'] = async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
};
export const Default: Story = { play: open };
export const HeadsUp: Story = { args: { current: 'heads-up' }, play: open };
export const OtherMail: Story = { args: { current: 'other-mail' }, play: open };
export const Closed: Story = {};
export const Hover: Story = {
  play: open,
  parameters: { pseudo: { hover: '[role="menuitem"]:not([aria-disabled])' } },
};
export const Pressed: Story = {
  play: open,
  parameters: { pseudo: { active: '[role="menuitem"]:not([aria-disabled])' } },
};
export const CurrentHover: Story = {
  play: open,
  parameters: { pseudo: { hover: '[aria-disabled="true"]' } },
};
export const Dark: Story = { play: open, globals: { theme: 'dark' } };
export const InSheet: Story = {
  args: { sheet: true },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open detail sheet' }),
    );
    const dialog = canvas.getByRole('dialog');
    await Promise.all(
      dialog.getAnimations().map((animation) => animation.finished),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
  },
};
export const KeyboardAndDismissal: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', {
      name: 'Move to',
    });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const enabled = page.getByRole('menuitem', {
      name: 'Heads-up No action needed',
    });
    await expect(enabled).toHaveFocus();
    const current = page.getByRole('menuitem', {
      name: 'Needs you You need to act',
    });
    await userEvent.click(current);
    await expect(args.onChoose).not.toHaveBeenCalled();
    current.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChoose).not.toHaveBeenCalled();
    await userEvent.keyboard('{Home}');
    await expect(enabled).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(
      page.getByRole('menuitem', { name: 'Other mail Not for you' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(page.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.click(
      canvas.getByText('Select outside the menu to close it.'),
    );
    await expect(trigger).toHaveFocus();
    await expect(page.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await userEvent.keyboard('{Enter}');
    await expect(args.onChoose).toHaveBeenCalledOnce();
    await expect(args.onChoose).toHaveBeenCalledWith('heads-up');
  },
};
