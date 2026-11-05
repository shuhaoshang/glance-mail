import { SectionCard } from '../SectionCard/SectionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, waitFor } from 'storybook/test';
import { DoneRow } from './DoneRow';
import { maya } from '../listSamples';
const meta = {
  title: 'Composites/DoneRow',
  component: DoneRow,
  decorators: [
    (Story) => (
      <SectionCard title="Done" count={1}>
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
