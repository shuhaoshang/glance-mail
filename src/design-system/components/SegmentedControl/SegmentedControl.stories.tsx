import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';
import { DetailTabsExample } from './DetailTabsExample';
import { itemViews } from './detailExampleData';

const meta = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'padded' },
  args: {
    'aria-label': 'Item views',
    options: itemViews,
    value: 'details',
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'select',
      options: itemViews.map((option) => option.value),
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <DetailTabsExample
        {...args}
        onValueChange={(value) => {
          args.onValueChange(value);
          updateArgs({ value });
        }}
      />
    );
  },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hover: Story = {
  parameters: { pseudo: { hover: '[role="tab"]:last-child' } },
};
export const FocusVisible: Story = {
  parameters: {
    pseudo: { focusVisible: '[role="tab"][aria-selected="true"]' },
  },
};
export const FocusAdjacentHover: Story = {
  parameters: {
    pseudo: {
      focusVisible: '[role="tab"][aria-selected="true"]',
      hover: '[role="tab"]:nth-child(2)',
    },
  },
};
export const SelectedHover: Story = {
  parameters: { pseudo: { hover: '[role="tab"][aria-selected="true"]' } },
};
export const SelectedPressed: Story = {
  parameters: {
    pseudo: {
      hover: '[role="tab"][aria-selected="true"]',
      active: '[role="tab"][aria-selected="true"]',
    },
  },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: '[role="tab"]:last-child' } },
};
export const WithDisabledTab: Story = {
  args: {
    options: itemViews.map((option) => ({
      ...option,
      disabled: option.value === 'email',
    })),
  },
};
export const KeyboardNavigation: Story = {
  ...WithDisabledTab,
  play: async ({ canvas }) => {
    const details = canvas.getByRole('tab', { name: 'Details' });
    await expect(
      canvas.getByRole('tab', { name: 'Original email' }),
    ).toBeDisabled();
    details.focus();

    async function checkKey(key: string, name: string) {
      await userEvent.keyboard(key);
      const tab = await canvas.findByRole('tab', { name, selected: true });
      await expect(tab).toHaveFocus();
      await expect(tab).toHaveAttribute('tabindex', '0');
      await expect(canvas.getByRole('tabpanel', { name })).toHaveAttribute(
        'id',
        tab.getAttribute('aria-controls'),
      );
    }
    await checkKey('{ArrowRight}', 'Ask');
    await checkKey('{ArrowRight}', 'Details');
    await checkKey('{ArrowLeft}', 'Ask');
    await checkKey('{Home}', 'Details');
    await checkKey('{End}', 'Ask');
    await checkKey('{Home}', 'Details');
    await userEvent.tab();
    await expect(
      canvas.getByRole('tabpanel', { name: 'Details' }),
    ).toHaveFocus();
  },
};

export const Small: Story = { args: { size: 'small' } };
export const SmallHover: Story = { ...Hover, args: Small.args };
export const SmallPressed: Story = { ...Pressed, args: Small.args };
export const SmallSelectedHover: Story = { ...SelectedHover, args: Small.args };
export const SmallSelectedPressed: Story = {
  ...SelectedPressed,
  args: Small.args,
};
export const SmallFocusAdjacentHover: Story = {
  ...FocusAdjacentHover,
  args: Small.args,
};
export const SmallKeyboardNavigation: Story = {
  ...KeyboardNavigation,
  args: { ...WithDisabledTab.args, ...Small.args },
};

export const Underline: Story = { args: { appearance: 'underline' } };
export const UnderlineKeyboard: Story = {
  ...KeyboardNavigation,
  args: { ...WithDisabledTab.args, appearance: 'underline' },
};
export const UnderlineFocus: Story = {
  ...FocusAdjacentHover,
  args: { appearance: 'underline' },
};
export const UnderlineHover: Story = { ...Hover, args: Underline.args };
export const UnderlinePressed: Story = { ...Pressed, args: Underline.args };
export const UnderlineSelectedHover: Story = {
  ...SelectedHover,
  args: Underline.args,
};
export const UnderlineSelectedPressed: Story = {
  ...SelectedPressed,
  args: Underline.args,
};
