import { SectionCard } from '../SectionCard/SectionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, waitFor } from 'storybook/test';
import { DoneRow } from './DoneRow';
import { maya } from '../listSamples';
const meta = {
  title: 'Composites/DoneRow',
  component: DoneRow,
  decorators: [
    (Story, context) => (
      <SectionCard title="Done" count={context.parameters.rowCount ?? 1}>
        <Story />
      </SectionCard>
    ),
  ],
  args: { ...maya.doneBefore[0], onUndo: undefined },
} satisfies Meta<typeof DoneRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Done: Story = {};
export const DoneBefore: Story = {
  play: async ({ canvas }) => {
    await waitFor(async () => {
      await expect(canvas.getByText(maya.doneBefore[0].name)).toBeVisible();
    });
    await expect(
      canvas.queryByRole('button', { name: /^Undo/ }),
    ).not.toBeInTheDocument();
  },
};
export const SessionDone: Story = {
  args: { name: maya.items[0].name, note: 'done', onUndo: fn() },
};
export const Snoozed: Story = {
  args: {
    name: maya.items[0].name,
    note: 'snoozed',
    kind: 'snoozed',
    onUndo: fn(),
  },
};
export const MovedToSetAside: Story = {
  args: {
    name: maya.items[2].name,
    note: 'moved to Set aside by you',
    kind: 'moved',
    onUndo: fn(),
  },
};
export const Undo: Story = {
  args: { ...SessionDone.args },
  play: async ({ canvas, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo ' + args.name }),
    );
    await expect(args.onUndo).toHaveBeenCalledOnce();
  },
};

export const AdjacentUndoTargets: Story = {
  parameters: { rowCount: 3 },
  args: { onUndo: fn() },
  render: (args) => (
    <>
      {maya.items
        .filter((item) => !item.isNew)
        .map((item) => (
          <DoneRow
            key={item.id}
            {...args}
            name={item.name}
            note="marked done in Glance"
          />
        ))}
    </>
  ),
  play: async ({ canvas }) => {
    const targets = canvas.getAllByRole('button', { name: /^Undo/ });
    await expect(targets).toHaveLength(3);
    const rects = [];
    for (const target of targets) {
      const row = target.closest('[role="listitem"]')!.getBoundingClientRect();
      const bounds = target.getBoundingClientRect();
      const minimum = parseFloat(
        getComputedStyle(target).getPropertyValue('--size-touch'),
      );
      await expect(bounds.height).toBeGreaterThanOrEqual(minimum);
      await expect(row.height).toBeGreaterThanOrEqual(minimum);
      await expect(bounds.top).toBeGreaterThanOrEqual(row.top);
      await expect(bounds.bottom).toBeLessThanOrEqual(row.bottom);
      rects.push(bounds);
    }
    for (let i = 1; i < rects.length; i++)
      await expect(rects[i].top).toBeGreaterThanOrEqual(rects[i - 1].bottom);
  },
};
