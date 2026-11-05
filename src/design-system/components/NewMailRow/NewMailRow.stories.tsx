import { SectionCard } from '../SectionCard/SectionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { NewMailRow } from './NewMailRow';
import { maya } from '../listSamples';
const meta = {
  title: 'Composites/NewMailRow',
  component: NewMailRow,
  decorators: [
    (Story) => (
      <SectionCard title="Needs you" count={0}>
        <Story />
      </SectionCard>
    ),
  ],
  args: { label: maya.newMail!.label, onAdd: fn() },
} satisfies Meta<typeof NewMailRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const AddToBrief: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add to brief' }));
    await expect(args.onAdd).toHaveBeenCalledOnce();
  },
};
