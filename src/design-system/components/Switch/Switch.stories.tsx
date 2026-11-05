import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Switch } from './Switch';
const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  args: { label: 'Highlighter', checked: false, onCheckedChange: fn() },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Switch
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
          '[Switch specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#switch). Press has no additional color override, and disabled retains its resting palette pending design review.',
      },
    },
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Off: Story = {};
export const On: Story = { args: { checked: true } };
export const OffHover: Story = { parameters: { pseudo: { hover: 'input' } } };
export const OnHover: Story = {
  args: { checked: true },
  parameters: { pseudo: { hover: 'input' } },
};
export const OffPressed: Story = {
  parameters: { pseudo: { hover: 'input', active: 'input' } },
};
export const OnPressed: Story = {
  args: { checked: true },
  parameters: { pseudo: { hover: 'input', active: 'input' } },
};
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'input' } },
};
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('switch');
    await expect(input).toBeDisabled();
    await userEvent.click(input);
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
export const DisabledOn: Story = { args: { checked: true, disabled: true } };
export const KeyboardAndLabel: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('switch', { name: 'Highlighter' });
    await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(input.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      44,
    );
    input.focus();
    await userEvent.keyboard(' ');
    await waitFor(async () => {
      await expect(canvas.getByRole('switch')).toBeChecked();
    });
    await expect(canvas.getByRole('switch')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.click(canvas.getByText('Highlighter'));
    await waitFor(async () => {
      await expect(canvas.getByRole('switch')).not.toBeChecked();
    });
    await expect(canvas.getByRole('switch')).toHaveAttribute(
      'aria-checked',
      'false',
    );
  },
};
