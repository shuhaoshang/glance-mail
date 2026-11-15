import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../../../data';
import { WatchlistPanel, type WatchlistPanelProps } from './WatchlistPanel';
const meta = {
  title: 'Composites/WatchlistPanel',
  component: WatchlistPanel,
  args: {
    items: getPersona('maya').watchlist,
    onAdd: fn(),
    onRename: fn(),
    onRemove: fn(),
    onOpenItem: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<WatchlistPanelProps>();
    return (
      <WatchlistPanel
        {...args}
        onAdd={(name, target) => {
          args.onAdd(name, target);
          updateArgs({
            items: [
              {
                id: 'added-' + args.items.length,
                name,
                status: 'Nothing yet',
                news: 0,
              },
              ...args.items,
            ],
          });
        }}
        onRename={(id, name, target) => {
          args.onRename(id, name, target);
          updateArgs({
            items: args.items.map((item) =>
              item.id === id ? { ...item, name } : item,
            ),
          });
        }}
        onRemove={(id, target) => {
          args.onRemove(id, target);
          updateArgs({ items: args.items.filter((item) => item.id !== id) });
        }}
      />
    );
  },
} satisfies Meta<typeof WatchlistPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Maya: Story = {};
export const Daniel: Story = {
  args: { items: getPersona('daniel').watchlist },
};
export const Sarah: Story = { args: { items: getPersona('sarah').watchlist } };
export const Empty: Story = { args: { items: [] } };
export const AddForm: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
    await expect(
      within(
        canvas.getByRole('form', { name: 'Add a Watchlist topic' }),
      ).getByRole('button', { name: 'Add' }),
    ).toBeDisabled();
  },
};
export const AddAndRename: Story = {
  play: async (context) => {
    const { canvas } = context;
    await AddForm.play?.(context);
    await userEvent.type(canvas.getByRole('textbox'), 'Okto renewal');
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Add' })).toHaveFocus(),
    );
    await expect(canvas.getAllByRole('listitem')[0]).toHaveTextContent(
      'Okto renewal',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Rename Okto renewal' }),
    );
    await userEvent.clear(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), 'Okto renewal follow-up');
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Rename Okto renewal follow-up' }),
      ).toHaveFocus(),
    );
  },
};
