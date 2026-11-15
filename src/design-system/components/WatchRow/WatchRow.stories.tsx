import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { getPersona } from '../../../data';
import { WatchRow, type WatchRowProps } from './WatchRow';
import styles from './WatchRow.module.css';
const topics = getPersona('maya').watchlist;
const meta = {
  title: 'Composites/WatchRow',
  component: WatchRow,
  args: { item: topics[0], onOpen: fn(), onRename: fn(), onRemove: fn() },
  decorators: [
    (Story) => (
      <ul className={styles.preview} aria-label="Watchlist topics">
        <Story />
      </ul>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs<WatchRowProps>();
    return (
      <WatchRow
        {...args}
        onRename={(id, name, target) => {
          args.onRename(id, name, target);
          updateArgs({ item: { ...args.item, name } });
        }}
      />
    );
  },
} satisfies Meta<typeof WatchRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WithNews: Story = {};
export const NoNews: Story = { args: { item: topics[3] } };
export const LongName: Story = { args: { item: topics[4] } };
export const UnavailableEmail: Story = { args: { onOpen: undefined } };
export const NewsHover: Story = {
  parameters: { pseudo: { hover: '[data-watch-news]' } },
};
export const NewsPressed: Story = {
  parameters: { pseudo: { active: '[data-watch-news]' } },
};
export const NewsFocus: Story = {
  parameters: { pseudo: { focusVisible: '[data-watch-news]' } },
};
export const RenameHover: Story = {
  parameters: { pseudo: { hover: '[data-watch-action="rename"]' } },
};
export const RenamePressed: Story = {
  parameters: { pseudo: { active: '[data-watch-action="rename"]' } },
};
export const RenameFocus: Story = {
  parameters: { pseudo: { focusVisible: '[data-watch-action="rename"]' } },
};
export const RemoveHover: Story = {
  parameters: { pseudo: { hover: '[data-watch-action="remove"]' } },
};
export const RemovePressed: Story = {
  parameters: { pseudo: { active: '[data-watch-action="remove"]' } },
};
export const RemoveFocus: Story = {
  parameters: { pseudo: { focusVisible: '[data-watch-action="remove"]' } },
};
export const Rename: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Rename Fernway renewal' }),
    );
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
export const EmptyRename: Story = {
  play: async (context) => {
    await Rename.play?.(context);
    await userEvent.clear(context.canvas.getByRole('textbox'));
    await userEvent.type(context.canvas.getByRole('textbox'), '   ');
    await expect(
      context.canvas.getByRole('button', { name: 'Save' }),
    ).toBeDisabled();
  },
};
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const news = canvas.getByRole('button', {
      name: '2 new for Fernway renewal',
    });
    news.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onOpen).toHaveBeenCalledOnce();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Rename Fernway renewal' }),
    );
    await userEvent.clear(canvas.getByRole('textbox'));
    await userEvent.type(
      canvas.getByRole('textbox'),
      'Fernway renewal follow-up',
    );
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        canvas.getByRole('button', {
          name: 'Rename Fernway renewal follow-up',
        }),
      ).toHaveFocus(),
    );
    await userEvent.keyboard('{Enter}');
    await userEvent.clear(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), 'Unsaved topic');
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        canvas.getByRole('button', {
          name: 'Rename Fernway renewal follow-up',
        }),
      ).toHaveFocus(),
    );
  },
};
