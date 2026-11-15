import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { TimeSelect } from './TimeSelect';

const meta = {
  title: 'Primitives/TimeSelect',
  component: TimeSelect,
  args: {
    label: 'Morning brief',
    value: '7:30 AM',
    options: ['7:00 AM', '7:30 AM', '8:00 AM'],
    onChange: fn(),
  },
  render: function Example(args) {
    const [value, setValue] = useState(args.value);
    return (
      <TimeSelect
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof TimeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: 'select' } } };
export const Pressed: Story = { parameters: { pseudo: { active: 'select' } } };
export const KeyboardFocus: Story = {
  parameters: { pseudo: { focusVisible: 'select' } },
};
export const Change: Story = {
  play: async ({ canvas, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Morning brief' });
    await userEvent.selectOptions(select, '8:00 AM');
    await expect(select).toHaveValue('8:00 AM');
  },
};
