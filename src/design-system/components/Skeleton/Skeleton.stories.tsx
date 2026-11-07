import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.stories.module.css';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BriefRowShape: Story = {
  render: () => (
    <div className={styles.row}>
      <Skeleton className={styles.rank} />
      <div className={styles.copy}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.request} />
        <div className={styles.chips}>
          <Skeleton className={styles.chip} />
          <Skeleton className={styles.chip} />
        </div>
      </div>
    </div>
  ),
};
