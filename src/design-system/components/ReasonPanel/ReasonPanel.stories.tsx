import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { getPersona } from '../../../data';
import { ReasonPanel } from './ReasonPanel';
import styles from './ReasonPanel.module.css';
import mayaV2 from '../../../../docs/handoff/v2/provided/data/maya.json';

const maya = getPersona('maya'),
  daniel = getPersona('daniel'),
  sarah = getPersona('sarah');
const meta = {
  title: 'Composites/ReasonPanel',
  component: ReasonPanel,
  args: { item: maya.items[0], position: 1 },
  decorators: [
    (Story) => (
      <div className={styles.preview}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReasonPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Maya: Story = {};
export const Daniel: Story = { args: { item: daniel.items[0] } };
export const Sarah: Story = { args: { item: sarah.items[0] } };
export const Evidence: Story = {
  ...Daniel,
  play: async ({ canvas, args }) => {
    const panel = canvas.getByRole('region', { name: 'Glance’s read' });
    await expect(panel).toHaveTextContent(args.item.rank);
    for (const judgment of args.item.judgments) {
      await expect(panel).toHaveTextContent(
        judgment.label + ': ' + judgment.why,
      );
      if (judgment.source) {
        await expect(panel).toHaveTextContent(
          judgment.source.pre + judgment.source.hl + judgment.source.post,
        );
      }
    }
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const Watchlist: Story = {
  args: { watchlist: { name: mayaV2.watchlist[0].name, onOpen: fn() } },
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('button', {
      name: 'Watchlist: ' + args.watchlist!.name,
    });
    await expect(canvas.getByText('Based on', { exact: true })).toBeVisible();
    link.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.watchlist!.onOpen).toHaveBeenCalledOnce();
    await expect(canvas.queryByText(/Not for you/)).not.toBeInTheDocument();
  },
};

export const WatchlistWithoutNavigation: Story = {
  args: { watchlist: { name: maya.watchlist[0].name } },
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByText('Based on Watchlist: ' + args.watchlist!.name, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  },
};
