import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect } from 'storybook/test';
import { getPersona } from '../../../data';
import { OtherMailList } from './MailList';
const p = getPersona('maya'),
  items = p.otherMail.rows.filter((row) => !row.isNew);
const meta = {
  title: 'Composites/MailList',
  component: OtherMailList,
  args: { items, total: p.otherMail.total, onSelect: fn() },
} satisfies Meta<typeof OtherMailList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OtherMail: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    await expect(canvas.getByText('27 more like these')).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /more like these/ }),
    ).not.toBeInTheDocument();
  },
};
export const ZeroRemaining: Story = {
  args: { total: items.length },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/more like these/)).not.toBeInTheDocument();
  },
};
export const Empty: Story = { args: { items: [], total: 0 } };
