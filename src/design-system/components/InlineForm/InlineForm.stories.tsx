import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { InlineForm } from './InlineForm';
import { InlineFormExample } from './InlineFormExample';
import styles from './InlineForm.stories.module.css';
import maya from '../../../../docs/handoff/v2/provided/data/maya.json';
const meta = {
  title: 'Composites/InlineForm',
  component: InlineForm,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Watchlist topic',
    placeholder: 'What are you waiting on?',
    value: '',
    onValueChange: fn(),
    onSubmit: fn(),
    onCancel: fn(),
    note: 'Glance looks for emails about it and puts them at the top.',
  },
  render: (args) => <InlineFormExample key={args.value} {...args} />,
} satisfies Meta<typeof InlineForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Filled: Story = { args: { value: maya.watchlist[0].name } };
export const Edit: Story = {
  args: { value: maya.watchlist[0].name, submitLabel: 'Save', note: undefined },
};
export const Memory: Story = {
  args: {
    label: 'Instruction',
    placeholder: 'Tell Glance a rule, in your own words',
    note: 'Glance follows it from the next email.',
  },
};
export const PhoneLongPlaceholder: Story = {
  args: { ...Memory.args, mobile: true },
  decorators: [
    (Story) => (
      <div className={styles.phonePreview}>
        <Story />
      </div>
    ),
  ],
};
export const Focused: Story = { args: { autoFocus: true } };
export const Dark: Story = { globals: { theme: 'dark' } };
export const SubmitAndCancel: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Watchlist topic' });
    await expect(canvas.getByRole('button', { name: 'Add' })).toBeDisabled();
    await userEvent.type(input, '   ');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.clear(input);
    await userEvent.type(input, maya.watchlist[0].name);
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await expect(args.onSubmit).toHaveBeenCalledWith(maya.watchlist[0].name);
    const trigger = canvas.getByRole('button', { name: 'Open form' });
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    canvas.getByRole('textbox').focus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(trigger).toHaveFocus();
  },
};
