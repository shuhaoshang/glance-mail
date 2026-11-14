import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { App } from './App';
const meta = {
  title: 'Patterns/New mail',
  component: App,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya', startClean: true },
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;
export const BeforeAdd: Story = {};
const add: NonNullable<Story['play']> = async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Add to brief' }));
  await expect(canvas.getByRole('tab', { name: 'Needs you 4' })).toBeVisible();
  await expect(
    canvas.getByRole('tab', { name: 'Other mail 32' }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('button', { name: /Okto Freight/ }),
  ).toHaveFocus();
  await expect(
    within(canvas.getByRole('list', { name: 'Needs you' }))
      .getAllByRole('button')
      .filter((node) => node.hasAttribute('data-brief-item'))
      .map((node) => node.dataset.briefItem),
  ).toEqual(['fernway', 'brightline', 'halden', 'okto']);
  await expect(
    canvas.getByText('2 new added: 1 here, 1 in Other mail'),
  ).toBeVisible();
};
export const Added: Story = { play: add };
export const AddedOtherMail: Story = {
  play: async (context) => {
    await add(context);
    await userEvent.click(
      context.canvas.getByRole('tab', { name: 'Other mail 32' }),
    );
    const list = within(
      context.canvas.getByRole('list', { name: 'Other mail' }),
    );
    await expect(list.getAllByRole('listitem')).toHaveLength(5);
    await expect(list.getAllByRole('listitem').at(-1)).toHaveTextContent(
      'Revenue Ops Digest',
    );
    await expect(context.canvas.getByText('27 more like these')).toBeVisible();
  },
};
