import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { App } from './App';

const meta = {
  title: 'Patterns/Memory',
  component: App,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya', startClean: true },
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;
type Play = Parameters<NonNullable<Story['play']>>[0];

async function open({ canvas, userEvent }: Play) {
  const entry =
    canvas.queryByRole('tab', { name: /^Memory / }) ??
    canvas.getByRole('button', { name: /^Memory$/ });
  await userEvent.click(entry);
  await waitFor(() =>
    expect(canvas.getByRole('heading', { name: /^Memory$/ })).toHaveFocus(),
  );
}

export const Maya: Story = { play: open };
export const Daniel: Story = { args: { personaId: 'daniel' }, play: open };
export const Sarah: Story = { args: { personaId: 'sarah' }, play: open };

export const AddForm: Story = {
  play: async (context) => {
    await open(context);
    await context.userEvent.click(
      context.canvas.getByRole('button', { name: /^Add$/ }),
    );
    await expect(
      context.canvas.getByRole('textbox', { name: 'Add an instruction' }),
    ).toHaveFocus();
  },
};
export const Promoted: Story = {
  play: async (context) => {
    await open(context);
    const { canvas, userEvent } = context;
    const learned = within(canvas.getByRole('list', { name: /^Learned$/ }));
    const first = within(learned.getAllByRole('listitem')[0]);
    await userEvent.click(first.getByRole('button', { name: /^Edit / }));
    const input = canvas.getByRole('textbox', { name: 'Edit memory note' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Keep Brightline admin reports in Heads-up.');
    await userEvent.keyboard('{Enter}');
    const instructions = within(
      canvas.getByRole('list', { name: 'Your instructions' }),
    );
    await expect(instructions.getAllByRole('listitem')[2]).toHaveTextContent(
      'Was learned · edited just now',
    );
    await expect(learned.getAllByRole('listitem')).toHaveLength(2);
  },
};
export const Removed: Story = {
  play: async (context) => {
    await open(context);
    const { canvas, userEvent } = context;
    const instructions = within(
      canvas.getByRole('list', { name: 'Your instructions' }),
    );
    await userEvent.click(
      within(instructions.getAllByRole('listitem')[0]).getByRole('button', {
        name: /^Remove /,
      }),
    );
    await expect(instructions.getAllByRole('listitem')).toHaveLength(1);
    await expect(
      within(document.body).getByText('Removed from Memory.'),
    ).toBeVisible();
  },
};
