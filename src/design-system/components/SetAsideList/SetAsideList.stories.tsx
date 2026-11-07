import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { getPersona } from '../../../data';
import styles from './SetAsideList.module.css';
import { SetAsideList } from './SetAsideList';
const maya = getPersona('maya');
const groups = maya.setAside.map((group) => ({
  ...group,
  rows: group.rows.filter((row) => !row.isNew),
}));
const meta = {
  title: 'Composites/SetAsideList',
  component: SetAsideList,
  decorators: [
    (Story) => (
      <div className={styles.preview}>
        <Story />
      </div>
    ),
  ],
  args: {
    groups,
    moved: [],
    kept: {},
    apps: ['Outlook'],
    onKeep: fn(),
    onUndoKeep: fn(),
    onRestore: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof SetAsideList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Kept: Story = {
  args: {
    kept: { n1: true },
    groups: groups.map((group) => ({
      ...group,
      count: group.count - (group.rows.some((row) => row.id === 'n1') ? 1 : 0),
    })),
  },
};
export const MovedByYou: Story = { args: { moved: [maya.items[2]] } };
export const Phone: Story = { args: { mobile: true, onClose: fn() } };

export const KeyboardKeep: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', {
      name: 'Show in brief: SaaS Sales Weekly',
    });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onKeep).toHaveBeenCalledWith('n1');
  },
};
export const ExactMovedRows: Story = {
  args: MovedByYou.args,
  play: async ({ canvas }) => {
    const moved = canvas.getByRole('region', { name: 'Moved by you' });
    await expect(moved.querySelectorAll('li')).toHaveLength(1);
    await expect(moved.textContent).not.toContain('more');
  },
};

for (const story of [Default, Kept, MovedByYou, Phone]) {
  story.play = async ({ canvasElement }) => {
    await Promise.all(
      canvasElement
        .getAnimations({ subtree: true })
        .map((a) => a.finished.catch(() => {})),
    );
    canvasElement.dataset.dsReady = 'true';
  };
}
