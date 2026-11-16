import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { CollapsedGroup } from './CollapsedGroup';

const groups = [
  { count: 5, short: 'newsletters' },
  { count: 3, short: 'promotions' },
];

const meta = {
  title: 'Composites/CollapsedGroup',
  component: CollapsedGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A compact section summary with the shared panel shadow. Interactive and static variants retain their existing states and content.',
      },
    },
  },
  args: { label: 'emails', groups, onSelect: fn() },
} satisfies Meta<typeof CollapsedGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const Selected: Story = { args: { selected: true } };
export const SelectedHover: Story = {
  args: { selected: true },
  parameters: { pseudo: { hover: true } },
};
export const KeyboardSelection: Story = {
  play: async ({ canvas, args }) => {
    const b = canvas.getByRole('button', { name: /8 emails/ });
    b.focus();
    await userEvent.keyboard(' ');
    await expect(args.onSelect).toHaveBeenCalledOnce();
  },
};

export const SelectedPressed: Story = {
  args: { selected: true },
  parameters: { pseudo: { active: true } },
};

export const Static: Story = {
  render: () => <CollapsedGroup label="emails" groups={groups} static />,
  play: async ({ canvas }) => {
    const summary = canvas.getByRole('region', { name: 'Emails' });
    await expect(summary).toHaveTextContent('8 emails');
    await expect(summary).toHaveTextContent(
      groups.map((group) => group.count + ' ' + group.short).join(' · '),
    );
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(summary).not.toHaveAttribute('tabindex');
    await expect(
      summary.querySelector('[tabindex], a[href], input, select, textarea'),
    ).not.toBeInTheDocument();
    await expect(summary.querySelector('svg')).not.toBeInTheDocument();
  },
};
