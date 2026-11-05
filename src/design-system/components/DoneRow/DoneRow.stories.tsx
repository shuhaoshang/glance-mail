import { SectionCard } from '../SectionCard/SectionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
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
  args: { ...maya.doneBefore[0], onUndo: fn() },
} satisfies Meta<typeof DoneRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Done: Story = {};
export const Snoozed: Story = {
  args: { name: maya.items[0].name, note: 'snoozed', kind: 'snoozed' },
};
export const MovedToSetAside: Story = {
  args: {
    name: maya.items[2].name,
    note: 'moved to Set aside by you',
    kind: 'moved',
  },
};
export const Undo: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo ' + args.name }),
    );
    await expect(args.onUndo).toHaveBeenCalledOnce();
  },
};
