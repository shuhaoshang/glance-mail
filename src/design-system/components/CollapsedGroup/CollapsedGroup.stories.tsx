import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { CollapsedGroup } from './CollapsedGroup';
import { maya } from '../listSamples';
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
  args: { groups: maya.setAside, onSelect: fn() },
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
    const b = canvas.getByRole('button', { name: /31 set aside/ });
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
  render: () => <CollapsedGroup groups={maya.setAside} static />,
  play: async ({ canvas }) => {
    const summary = canvas.getByRole('region', { name: 'Set aside' });
    await expect(summary).toHaveTextContent('31 set aside');
    await expect(summary).toHaveTextContent(
      maya.setAside.map((group) => group.count + ' ' + group.short).join(' · '),
    );
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(summary).not.toHaveAttribute('tabindex');
    await expect(
      summary.querySelector('[tabindex], a[href], input, select, textarea'),
    ).not.toBeInTheDocument();
    await expect(summary.querySelector('svg')).not.toBeInTheDocument();
  },
};

export const GoodToKnow: Story = {
  args: {
    label: 'good to know',
    groups: [{ count: 14, short: 'good to know' }],
    summary: 'Schedule changes, deliveries and receipts',
    onSelect: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', {
      name: '14 good to know Schedule changes, deliveries and receipts',
    });
    await expect(button.querySelector('svg')).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onSelect).toHaveBeenCalledWith(button);
  },
};

export const SetAsideSummary: Story = {
  args: {
    groups: [{ count: 8, short: 'set aside' }],
    summary: 'Newsletters, promotions and CC’d',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', {
        name: '8 set aside Newsletters, promotions and CC’d',
      }),
    ).toBeVisible();
  },
};

export const OverloadSetAside: Story = {
  args: {
    ...SetAsideSummary.args,
    groups: [{ count: 210, short: 'set aside' }],
  },
};

export const QuietHoursSetAside: Story = {
  args: {
    groups: [{ count: 3, short: 'set aside' }],
    summary: 'Newsletters and promotions',
  },
};
