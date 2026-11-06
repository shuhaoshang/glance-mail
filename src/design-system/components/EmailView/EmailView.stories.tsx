import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { getPersona } from '../../../data';
import { EmailView } from './EmailView';
import styles from './EmailView.module.css';

const maya = getPersona('maya'),
  daniel = getPersona('daniel'),
  sarah = getPersona('sarah');
const meta = {
  title: 'Composites/EmailView',
  component: EmailView,
  args: {
    item: maya.items[0],
    account: maya.accounts[0],
    highlighted: true,
    onHighlightedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <EmailView
        {...args}
        onHighlightedChange={(highlighted) => {
          args.onHighlightedChange(highlighted);
          updateArgs({ highlighted });
        }}
      />
    );
  },
  decorators: [
    (Story) => (
      <div className={styles.preview}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmailView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Maya: Story = {};
export const Daniel: Story = {
  args: { item: daniel.items[0], account: daniel.accounts[0] },
};
export const Sarah: Story = {
  args: { item: sarah.items[0], account: sarah.accounts[1] },
};
export const HighlighterOff: Story = { args: { highlighted: false } };
export const KeyboardHighlighter: Story = {
  play: async ({ canvas, args }) => {
    const body = canvas.getByTestId('email-body');
    const expected = args.item.email.paras
      .flat()
      .map((segment) => (typeof segment === 'string' ? segment : segment.t))
      .join('');
    await expect(body.textContent).toBe(expected);
    const marks = Array.from(body.querySelectorAll('mark'));
    await expect(marks.length).toBeGreaterThan(0);
    const control = canvas.getByRole('switch', { name: 'Highlighter' });
    control.focus();
    await userEvent.keyboard(' ');
    await waitFor(async () => {
      await expect(canvas.getByRole('switch')).not.toBeChecked();
    });
    await waitFor(async () => {
      await expect(getComputedStyle(marks[0]).backgroundSize).toBe('0% 100%');
    });
    await expect(body.textContent).toBe(expected);
    const annotated = body.querySelector<HTMLElement>('[title]');
    await expect(annotated).toHaveAttribute('tabindex', '0');
    await expect(annotated?.getAttribute('title')).toBeTruthy();
    await userEvent.keyboard(' ');
    await waitFor(async () => {
      await expect(canvas.getByRole('switch')).toBeChecked();
    });
    await waitFor(async () => {
      await expect(getComputedStyle(marks[0]).backgroundSize).toBe('100% 100%');
    });
    await expect(body.textContent).toBe(expected);
    annotated?.focus();
    await expect(annotated).toHaveFocus();
  },
};
