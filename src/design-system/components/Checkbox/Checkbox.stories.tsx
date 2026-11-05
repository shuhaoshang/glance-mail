import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { ChecklistExample } from '../RemainingExamples';
import { schoolSteps, schoolPayLabel } from '../remainingSamples';
const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  args: { label: schoolSteps[0].pre, checked: false, onCheckedChange: fn() },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Checkbox
        {...args}
        onCheckedChange={(checked) => {
          args.onCheckedChange(checked);
          updateArgs({ checked });
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          '[Checkbox specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#checkbox). The 24px box sits inside a native 44px input target. Disabled uses the sunken box, muted ring/check, and muted label. Inline Fields remain independent.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Hover: Story = { parameters: { pseudo: { hover: 'input' } } };
export const Pressed: Story = { parameters: { pseudo: { active: 'input' } } };
export const CheckedHover: Story = {
  args: { checked: true },
  parameters: { pseudo: { hover: 'input' } },
};
export const CheckedPressed: Story = {
  args: { checked: true },
  parameters: { pseudo: { active: 'input' } },
};
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'input' } },
};
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('checkbox');
    await expect(input).toBeDisabled();
    await userEvent.click(input);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};
export const CompletedChecklist: Story = {
  render: () => <ChecklistExample initiallyComplete />,
};
export const WithField: Story = { render: () => <ChecklistExample /> };
export const KeyboardAndLabel: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('checkbox');
    await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(input.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      44,
    );
    input.focus();
    await userEvent.keyboard(' ');
    await waitFor(async () => {
      await expect(canvas.getByRole('checkbox')).toBeChecked();
    });
    await userEvent.click(canvas.getByText(schoolSteps[0].pre));
    await waitFor(async () => {
      await expect(canvas.getByRole('checkbox')).not.toBeChecked();
    });
  },
};
export const IndependentField: Story = {
  render: () => <ChecklistExample />,
  play: async ({ canvas }) => {
    const pay = canvas.getByRole('checkbox', { name: schoolPayLabel });
    await expect(pay).not.toBeChecked();
    await userEvent.click(
      canvas.getByRole('button', { name: '$12. Show where the email says so' }),
    );
    await expect(pay).not.toBeChecked();
    await waitFor(
      async () =>
        await expect(
          canvas.getByRole('region', { name: 'Source from Ms. Rivera' }),
        ).toBeVisible(),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await userEvent.click(
      canvas.getByRole('checkbox', { name: schoolSteps[0].pre }),
    );
    await userEvent.click(pay);
    await expect(pay).toBeChecked();
    await userEvent.click(
      canvas.getByRole('button', { name: '$12. Show where the email says so' }),
    );
    await expect(pay).toBeChecked();
    await expect(
      canvas.getByRole('button', { name: '$12. Show where the email says so' }),
    ).toHaveAttribute('aria-expanded', 'true');
  },
};
