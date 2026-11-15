import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { getPersona } from '../../../data';
import { MemoryRow } from './MemoryRow';

const maya = getPersona('maya');
const meta = {
  title: 'Composites/MemoryRow',
  component: MemoryRow,
  args: {
    note: maya.memory.instructions[0],
    kind: 'instructions',
    onEdit: fn(),
    onCancel: fn(),
    onSave: fn(),
    onRemove: fn(),
  },
  render: function Example(args) {
    const [editing, setEditing] = useState(args.editing);
    return (
      <ul>
        <MemoryRow
          {...args}
          editing={editing}
          onEdit={() => {
            args.onEdit();
            setEditing(true);
          }}
          onCancel={() => {
            args.onCancel();
            setEditing(false);
          }}
          onSave={(text) => {
            args.onSave(text);
            setEditing(false);
          }}
        />
      </ul>
    );
  },
} satisfies Meta<typeof MemoryRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Instruction: Story = {};
export const Learned: Story = {
  args: { kind: 'learned', note: maya.memory.learned[0] },
};
export const EditHover: Story = {
  parameters: { pseudo: { hover: '[data-memory-edit]' } },
};
export const EditPressed: Story = {
  parameters: { pseudo: { active: '[data-memory-edit]' } },
};
export const EditFocus: Story = {
  parameters: { pseudo: { focusVisible: '[data-memory-edit]' } },
};
export const RemoveHover: Story = {
  parameters: { pseudo: { hover: 'button[aria-label^="Remove "]' } },
};
export const RemovePressed: Story = {
  parameters: { pseudo: { active: 'button[aria-label^="Remove "]' } },
};
export const RemoveFocus: Story = {
  parameters: { pseudo: { focusVisible: 'button[aria-label^="Remove "]' } },
};
export const Editing: Story = { args: { editing: true } };
export const EmptyEdit: Story = {
  ...Editing,
  play: async ({ canvas, userEvent }) => {
    await userEvent.clear(canvas.getByRole('textbox'));
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled();
  },
};
