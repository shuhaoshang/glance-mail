import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { TextInput } from './TextInput';
import { TextInputExample } from './TextInputExample';
import maya from '../../../../docs/handoff/v2/provided/data/maya.json';
import styles from '../feedbackExamples.module.css';
const meta = {
  title: 'Primitives/TextInput',
  component: TextInput,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Watchlist topic',
    placeholder: 'What are you waiting on?',
    value: '',
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className={styles.example}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TextInputExample key={String(args.value ?? '')} {...args} />
  ),
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const HiddenLabel: Story = { args: { hideLabel: true } };
export const Filled: Story = { args: { value: maya.watchlist[0].name } };
export const Focused: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole('textbox').focus();
  },
};
export const Memory: Story = {
  args: {
    label: 'Instruction',
    placeholder: 'Tell Glance a rule, in your own words',
  },
};
export const Dark: Story = { globals: { theme: 'dark' } };
export const Editing: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Watchlist topic' });
    await userEvent.type(input, maya.watchlist[0].name);
    await expect(input).toHaveValue(maya.watchlist[0].name);
    await expect(args.onChange).toHaveBeenCalled();
  },
};
