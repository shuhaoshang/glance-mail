import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { ProgressBar } from './ProgressBar';
import { Text } from '../Text/Text';
import { ProgressExample } from '../RemainingExamples';
import { remainingMaya, progressTotal } from '../remainingSamples';
import styles from '../RemainingExamples.module.css';
const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  args: { value: remainingMaya.doneBefore.length / progressTotal },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 1 / progressTotal },
    },
  },
  render: (args) => (
    <div className={styles.progress}>
      <Text
        as="p"
        variant="meta"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {Math.round(args.value * progressTotal) +
          ' of ' +
          progressTotal +
          ' done'}
      </Text>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Complete: Story = { args: { value: 1 } };
export const Interactive: Story = { render: () => <ProgressExample /> };
export const AccessibleStatus: Story = {
  ...Interactive,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
    await expect(canvas.getAllByRole('status')).toHaveLength(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Advance example' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('2 of 4 done');
    for (let count = 2; count < progressTotal; count += 1) {
      await userEvent.click(
        canvas.getByRole('button', { name: 'Advance example' }),
      );
    }
    await expect(
      canvas.getByRole('button', { name: 'Advance example' }),
    ).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 of 4 done');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset example' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('1 of 4 done');
  },
};
