import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { ReasonPill } from './ReasonPill';
import { reasonLabel } from '../ReasonPanel/reasonText';
import { daniel, maya, sarah, upsell } from '../listSamples';
import styles from './ReasonPill.stories.module.css';
const meta = {
  title: 'Primitives/ReasonPill',
  component: ReasonPill,
  args: {
    label: reasonLabel(1, maya.items[0].judgments[0].label),
    onToggle: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default'] },
  },
  parameters: { layout: 'centered' },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ReasonPill
        {...args}
        onToggle={() => {
          args.onToggle();
          updateArgs({ expanded: !args.expanded });
        }}
      />
    );
  },
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
    label: reasonLabel(1, daniel.items[0].judgments[0].label),
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

export const NoJudgment: Story = {
  args: { label: reasonLabel(2) },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Why it’s second' }),
    ).toBeVisible();
  },
};
export const ElevenItems: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <ol className={styles.ranks}>
      {[...maya.items, ...daniel.items, ...sarah.items].map((item, index) => (
        <li key={item.id}>
          <span>{item.name}</span>
          <ReasonPill
            {...args}
            label={reasonLabel(index + 1, item.judgments[0]?.label)}
          />
        </li>
      ))}
    </ol>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(11);
    await expect(
      canvas.getByRole('button', { name: 'Why it’s first: Renewal risk' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Why it’s ranked 11th' }),
    ).toBeVisible();
  },
};

export const Toggle: Story = {
  play: async ({ canvas, args }) => {
    const pill = canvas.getByRole('button', {
      name: 'Why it’s first: Renewal risk',
    });
    pill.focus();
    await userEvent.keyboard('{Enter}');
    await expect(pill).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(pill).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).toHaveBeenCalledTimes(2);
  },
};
