import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { CollapsedGroup } from './CollapsedGroup';
import { maya } from '../listSamples';
const meta = {
  title: 'Composites/CollapsedGroup',
  component: CollapsedGroup,
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
