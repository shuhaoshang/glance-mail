import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FactChip } from './FactChip';
import { factSamples, urgentFact } from '../factSamples';

const meta = {
  title: 'Primitives/FactChip',
  component: FactChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '[FactChip specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#factchip). A static fact label, never an action button.',
      },
    },
  },
  args: { ...factSamples.money.fact },
  play: async ({ canvas, args }) => {
    const chip = canvas.getByText(args.label, { exact: true });
    await expect(chip).not.toHaveAttribute('aria-label');
    await expect(chip).toHaveTextContent(
      args.kind + ': ' + args.label + (args.urgent ? ', urgent' : ''),
    );
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
} satisfies Meta<typeof FactChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Money: Story = {};
export const Time: Story = { args: { ...factSamples.money.item.facts[2] } };
export const People: Story = { args: { ...factSamples.people.fact } };
export const Urgent: Story = {
  args: { ...urgentFact },
};
