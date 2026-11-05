import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, waitFor } from 'storybook/test';
import { KnowRow } from './KnowRow';
import { SectionCard } from '../SectionCard/SectionCard';
import { maya, sarah, upsell } from '../listSamples';
const meta = {
  title: 'Composites/KnowRow',
  component: KnowRow,
  args: { item: maya.goodToKnow[0], onOpenEmail: fn() },
  decorators: [
    (Story) => (
      <SectionCard title="Good to know" count={1}>
        <Story />
      </SectionCard>
    ),
  ],
} satisfies Meta<typeof KnowRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Time: Story = { args: { item: sarah.goodToKnow[0] } };
export const PeopleAndJudgment: Story = { args: { item: upsell } };
export const MovedByYou: Story = {
  render: () => <KnowRow item={maya.items[2]} onOpenEmail={fn()} />,
};
export const OnePanelPerCard: Story = {
  decorators: [],
  render: (args) => (
    <SectionCard title="Good to know" count={2}>
      <KnowRow item={maya.goodToKnow[0]} onOpenEmail={args.onOpenEmail} />
      <KnowRow item={upsell} onOpenEmail={args.onOpenEmail} />
    </SectionCard>
  ),
  play: async ({ canvas, args }) => {
    const first = canvas.getByRole('button', {
      name: maya.goodToKnow[0].fact.value + '. Show where the email says so',
    });
    await userEvent.click(first);
    await waitFor(
      async () =>
        await expect(
          canvas.getByRole('region', {
            name: 'Source from ' + maya.goodToKnow[0].fact.source.from,
          }),
        ).toBeVisible(),
    );
    const second = canvas.getByRole('button', {
      name: upsell.fact.value + '. Show where the email says so',
    });
    await userEvent.click(second);
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(
      canvas.queryByRole('region', {
        name: 'Source from ' + maya.goodToKnow[0].fact.source.from,
      }),
    ).not.toBeInTheDocument();
    const reason = canvas.getByRole('button', { name: upsell.judgment.label });
    await userEvent.click(reason);
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await expect(reason).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('region', { name: upsell.judgment.label }),
    ).toBeInTheDocument();
    await expect(
      canvas.getAllByRole('region', { name: /^Source from/ }),
    ).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Open email' }));
    await expect(args.onOpenEmail).toHaveBeenCalledWith(upsell.judgment.source);
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await expect(reason).toHaveFocus();
    await expect(reason).toHaveAttribute('aria-expanded', 'false');
  },
};
