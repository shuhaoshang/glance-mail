import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { App } from './App';
const meta = {
  title: 'Patterns/Watchlist',
  component: App,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya', startClean: true },
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];
async function open(canvas: Canvas) {
  await userEvent.click(
    canvas.queryByRole('tab', { name: /^Watchlist/ }) ??
      canvas.getByRole('button', { name: /^Watchlist/ }),
  );
  await waitFor(() =>
    expect(canvas.getByRole('heading', { name: 'Watchlist' })).toBeVisible(),
  );
}
export const Maya: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(8);
  },
};
export const Daniel: Story = {
  args: { personaId: 'daniel' },
  play: async ({ canvas }) => {
    await open(canvas);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
  },
};
export const Sarah: Story = {
  args: { personaId: 'sarah' },
  play: async ({ canvas }) => {
    await open(canvas);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
  },
};
export const AddForm: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
export const Added: Story = {
  play: async (context) => {
    await AddForm.play?.(context);
    await userEvent.type(context.canvas.getByRole('textbox'), 'Okto renewal');
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        context.canvas.getByRole('button', { name: 'Rename Okto renewal' }),
      ).toBeVisible(),
    );
    await expect(
      within(document.body).getByText('Added to Watchlist.', { exact: true }),
    ).toBeVisible();
  },
};
export const Rename: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Rename Fernway renewal' }),
    );
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
export const Renamed: Story = {
  play: async (context) => {
    await Rename.play?.(context);
    await userEvent.clear(context.canvas.getByRole('textbox'));
    await userEvent.type(
      context.canvas.getByRole('textbox'),
      'Fernway renewal follow-up',
    );
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(
        context.canvas.getByRole('button', {
          name: 'Rename Fernway renewal follow-up',
        }),
      ).toHaveFocus(),
    );
  },
};
export const Removed: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove Halden Health deal' }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Rename Corvo Retail QBR' }),
      ).toHaveFocus(),
    );
  },
};
export const UndoRemoval: Story = {
  play: async (context) => {
    await Removed.play?.(context);
    await userEvent.click(
      within(document.body).getByRole('button', { name: 'Undo' }),
    );
    await waitFor(() =>
      expect(
        context.canvas.getByRole('button', {
          name: 'Rename Halden Health deal',
        }),
      ).toHaveFocus(),
    );
  },
};
export const NoNews: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    for (const name of [
      'Fernway renewal',
      'Halden Health deal',
      'Corvo Retail QBR',
    ])
      await userEvent.click(
        canvas.getByRole('button', { name: 'Remove ' + name }),
      );
    await expect(
      canvas.queryByRole('tab', { name: /Watchlist.*new/ }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole('button', { name: 'Watchlist, new' }),
    ).not.toBeInTheDocument();
  },
};
export const Empty: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    while (canvas.queryAllByRole('button', { name: /^Remove / }).length)
      await userEvent.click(
        canvas.getAllByRole('button', { name: /^Remove / })[0],
      );
    await expect(
      canvas.getByText('Nothing on your Watchlist.', { exact: true }),
    ).toBeVisible();
  },
};
export const NeedsYouLink: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: '2 new for Fernway renewal' }),
    );
    await expect(
      within(canvas.getByRole('region', { name: 'Selected item' })).getByRole(
        'heading',
        { name: 'Fernway Logistics' },
      ),
    ).toBeVisible();
  },
};
export const HeadsUpLink: Story = {
  play: async ({ canvas }) => {
    await open(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: '1 new for Corvo Retail QBR' }),
    );
    await expect(
      within(canvas.getByRole('region', { name: 'Selected item' })).getByRole(
        'heading',
        { name: 'Corvo Retail QBR' },
      ),
    ).toBeVisible();
  },
};
