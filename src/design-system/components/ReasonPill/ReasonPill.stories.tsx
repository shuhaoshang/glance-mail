import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { ReasonPill } from './ReasonPill';
import { daniel, maya, upsell } from '../listSamples';
import styles from './ReasonPill.stories.module.css';
const meta = {
  title: 'Primitives/ReasonPill',
  component: ReasonPill,
  args: { label: maya.items[0].judgments[0].label, onToggle: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ReasonPill>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = {
  args: { size: 'small', label: upsell.judgment.label },
};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const Expanded: Story = { args: { expanded: true } };
export const SmallTarget: Story = {
  ...Small,
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      44,
    );
    await expect(button.firstElementChild?.getBoundingClientRect().height).toBe(
      24,
    );
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onToggle).toHaveBeenCalledOnce();
  },
};

export const PhoneWrapped: Story = {
  args: {
    mobile: true,
    label: [
      'Glance’s read: Ranked 1st',
      ...daniel.items[0].judgments.map((judgment) => judgment.label),
      'Why?',
    ].join(' · '),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className={styles.phonePreview}>
        <Story />
      </div>
    ),
  ],
};
