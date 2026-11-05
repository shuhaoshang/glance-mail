import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Highlight } from './Highlight';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import { evidence, factSamples } from '../factSamples';
import styles from '../FactExamples.module.css';

const meta = {
  title: 'Primitives/Highlight',
  component: Highlight,
  parameters: {
    docs: {
      description: {
        component:
          '[Highlight specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#highlight). Ink follows the fact type. The selected ring is distinct from keyboard focus.',
      },
    },
  },
  args: { kind: 'money', children: factSamples.money.fact.source.hl },
  decorators: [
    (Story) => (
      <Text variant="reading" as="p">
        <Story />
      </Text>
    ),
  ],
} satisfies Meta<typeof Highlight>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Money: Story = {};
export const Time: Story = {
  args: { kind: 'time', children: factSamples.time.fact.source.hl },
};
export const People: Story = {
  args: { kind: 'people', children: factSamples.people.fact.source.hl },
};
export const Judgment: Story = {
  args: { kind: 'judgment', children: evidence.hl, wrap: true },
};
export const Selected: Story = { args: { selected: true } };
export const Wrapped: Story = {
  args: { kind: 'judgment', children: evidence.hl, selected: true, wrap: true },
  render: (args) => (
    <span className={styles.wrap}>
      {evidence.pre}
      <Highlight {...args} />
      {evidence.post}
    </span>
  ),
};
function ReplayInk() {
  const [playback, setPlayback] = useState(0);
  return (
    <span className={styles.example}>
      <span>
        <Highlight key={playback} kind="people" selected animate>
          {factSamples.people.fact.source.hl}
        </Highlight>
      </span>
      <Button
        variant="neutral"
        size="compact"
        onClick={() => setPlayback((value) => value + 1)}
      >
        Replay ink sweep
      </Button>
    </span>
  );
}
export const Animated: Story = { render: () => <ReplayInk /> };
