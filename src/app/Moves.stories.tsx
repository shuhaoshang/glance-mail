import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { App } from './App';
const meta = {
  title: 'Patterns/Move to',
  component: App,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya', startClean: true },
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];
async function pick(canvas: Canvas, tab: string, id: string) {
  const dialog = canvas.queryByRole('dialog');
  if (dialog) {
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close detail' }),
    );
    await waitFor(() =>
      expect(canvas.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  }
  await userEvent.click(
    canvas.getByRole('tab', { name: new RegExp('^' + tab + ' ') }),
  );
  const row = canvas
    .getByRole('list', { name: tab })
    .querySelector<HTMLButtonElement>(
      '[data-brief-item="' + id + '"], [data-mail-item="' + id + '"]',
    )!;
  await userEvent.click(row);
}
async function move(canvas: Canvas, to: string) {
  const body = within(document.body);
  await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
  await userEvent.click(
    body.getByRole('menuitem', { name: new RegExp('^' + to + ' ') }),
  );
  await waitFor(() =>
    expect(
      body.getByText('Moved to ' + to + '.', { exact: true }),
    ).toBeVisible(),
  );
  await waitFor(() =>
    expect(canvas.queryByRole('dialog')).not.toBeInTheDocument(),
  );
}
export const Menu: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'fernway');
    await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
    await expect(
      within(document.body).getByRole('menuitem', { name: /^Needs you / }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
};
export const DanielMenu: Story = {
  args: { personaId: 'daniel' },
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'checkout');
    await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
  },
};
export const SarahMenu: Story = {
  args: { personaId: 'sarah' },
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'lincoln');
    await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
  },
};
export const MovedToOtherMail: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'fernway');
    await move(canvas, 'Other mail');
    await expect(
      canvas.getByRole('tab', { name: 'Needs you 2' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Other mail 32' }),
    ).toBeVisible();
  },
};
export const MovedDetail: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'fernway');
    await move(canvas, 'Heads-up');
    await pick(canvas, 'Heads-up', 'fernway');
    await expect(
      canvas.getByText(
        'You moved this here. Glance will sort emails like it the same way.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'Done' }),
    ).not.toBeInTheDocument();
  },
};
export const Newsletter: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Other mail', 'n1');
    await move(canvas, 'Heads-up');
    await pick(canvas, 'Heads-up', 'n1');
  },
};
export const Undo: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'fernway');
    await move(canvas, 'Other mail');
    await userEvent.click(
      within(document.body).getByRole('button', { name: 'Undo' }),
    );
    await waitFor(() =>
      expect(canvas.getByRole('tab', { name: 'Needs you 3' })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    );
    await expect(
      canvas.getByRole('tab', { name: 'Other mail 31' }),
    ).toBeVisible();
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
export const ReturnedToOriginal: Story = {
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'fernway');
    await move(canvas, 'Heads-up');
    await pick(canvas, 'Heads-up', 'fernway');
    await move(canvas, 'Needs you');
    await pick(canvas, 'Needs you', 'fernway');
    const list = within(canvas.getByRole('list', { name: 'Needs you' }));
    await expect(
      list.queryByText('Moved by you', { exact: true }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('region', { name: 'Selected item' }),
    ).toHaveTextContent('Needs you · 3 of 3');
  },
};
export const LastNeedsYou: Story = {
  play: async ({ canvas }) => {
    for (const id of ['fernway', 'brightline', 'halden']) {
      await pick(canvas, 'Needs you', id);
      await move(canvas, 'Other mail');
    }
    await expect(
      canvas.getByRole('region', { name: 'All done' }),
    ).toBeVisible();
  },
};
export const ChecklistComplete: Story = {
  args: { personaId: 'sarah' },
  play: async ({ canvas }) => {
    await pick(canvas, 'Needs you', 'lincoln');
    for (const name of ['Sign the permission slip', 'Pay $12'])
      await userEvent.click(canvas.getByRole('checkbox', { name }));
    await expect(
      canvas.getByRole('button', { name: 'Mark done' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Move to' }));
  },
};

export const PersonalMoved: Story = {
  args: { personaId: 'daniel' },
  play: async ({ canvas }) => {
    await pick(canvas, 'Heads-up', 'h3');
    await move(canvas, 'Other mail');
    await pick(canvas, 'Other mail', 'h3');
    await expect(
      canvas.getByRole('link', { name: 'Open in Gmail' }),
    ).toBeVisible();
    await expect(
      within(canvas.getByRole('region', { name: 'Selected item' })).getByText(
        'Personal',
        { exact: true },
      ),
    ).toBeVisible();
  },
};
