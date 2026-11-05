import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateTile } from './DateTile';
import { appointmentDate, rangeDates } from '../remainingSamples';
import styles from '../RemainingExamples.module.css';
const meta = {
  title: 'Primitives/DateTile',
  component: DateTile,
  args: { date: appointmentDate },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '[DateTile specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#datetile). A static date display using the supplied calendar-tile reference.',
      },
    },
  },
} satisfies Meta<typeof DateTile>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Range: Story = {
  render: () => (
    <div className={styles.row}>
      {rangeDates.map((date) => (
        <DateTile key={date.month + date.day} date={date} />
      ))}
    </div>
  ),
};
