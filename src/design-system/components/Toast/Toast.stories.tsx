import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ToastExample } from './ToastExample';
const meta = {
  title: 'Primitives/Toast',
  component: ToastExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false },
      description: {
        component:
          'One confirmation at a time, with a six-second timer paused while the pointer or focus is inside. Use the example buttons to replay or replace it. The provider accepts the open dialog as its portal container and measures the phone action bar. Undo and close keep their base colors on hover and press pending an inverse-surface state decision.',
      },
    },
  },
  args: { onUndo: fn(), kind: 'move', withUndo: true, initiallyVisible: true },
} satisfies Meta<typeof ToastExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutUndo: Story = { args: { withUndo: false } };
export const Short: Story = { args: { kind: 'saved', withUndo: false } };
export const Watchlist: Story = { args: { kind: 'watchlist' } };
export const Memory: Story = { args: { kind: 'memory' } };
export const Interactive: Story = { args: { initiallyVisible: false } };
export const Dark: Story = { globals: { theme: 'dark' } };
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement.ownerDocument.body)
      .getByRole('button', { name: 'Undo' })
      .focus();
  },
};
export const Hovered: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(
      within(canvasElement.ownerDocument.body).getByRole('button', {
        name: 'Undo',
      }),
    );
  },
};
export const Replacement: Story = {
  args: { initiallyVisible: false },
  play: async ({ canvas, canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show move confirmation' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show saved confirmation' }),
    );
    await expect(page.getByRole('status')).toHaveTextContent('Saved.');
    await expect(page.getByRole('status')).not.toHaveTextContent('Moved to');
    await expect(
      page.queryByRole('button', { name: 'Undo' }),
    ).not.toBeInTheDocument();
  },
};
export const UndoOnce: Story = {
  args: { initiallyVisible: false },
  play: async ({ canvas, canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', {
      name: 'Show move confirmation',
    });
    await userEvent.click(trigger);
    await userEvent.dblClick(page.getByRole('button', { name: 'Undo' }));
    await expect(args.onUndo).toHaveBeenCalledOnce();
    await expect(trigger).toHaveFocus();
    await expect(
      page.queryByRole('button', { name: 'Close confirmation' }),
    ).not.toBeInTheDocument();
  },
};
export const InSheet: Story = {
  args: { sheet: true, initiallyVisible: false },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open detail sheet' }),
    );
    const dialog = canvas.getByRole('dialog');
    await Promise.all(
      dialog.getAnimations().map((animation) => animation.finished),
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Show confirmation' }),
    );
    await expect(
      within(canvasElement.ownerDocument.body).getByRole('button', {
        name: 'Undo',
      }),
    ).toHaveTextContent('Moved to Heads-up.');
  },
};
