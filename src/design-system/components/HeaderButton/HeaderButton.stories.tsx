import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent } from 'storybook/test';
import { HeaderButton } from './HeaderButton';
const meta = {
  title: 'Primitives/HeaderButton',
  component: HeaderButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The phone Watchlist and Memory shortcuts have a 40-pixel glass circle and an invisible 44-pixel hit target. Ink indicates the open view. Section 9.2 does not define hover or pressed styling; these states retain the default appearance pending review. Keyboard focus uses the shared focus tokens.',
      },
    },
  },
  args: {
    icon: 'eye',
    label: 'Watchlist',
    hasNews: true,
    selected: false,
    onClick: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <HeaderButton
        {...args}
        onClick={() => {
          args.onClick();
          updateArgs({ selected: true });
        }}
      />
    );
  },
} satisfies Meta<typeof HeaderButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Watchlist: Story = {};
export const WithoutNews: Story = { args: { hasNews: false } };
export const Selected: Story = { args: { selected: true } };
export const Memory: Story = {
  args: { icon: 'star', label: 'Memory', hasNews: false },
};
export const MemorySelected: Story = {
  args: { ...Memory.args, selected: true },
};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const SelectedFocus: Story = {
  ...FocusVisible,
  args: { selected: true },
};
export const Dark: Story = { globals: { theme: 'dark' } };
export const KeyboardActivation: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Watchlist, new' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await expect(button).toHaveFocus();
  },
};
