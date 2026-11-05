import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: 'Open in Gmail', variant: 'primary', onClick: fn() },
  argTypes: {
    href: {
      control: 'text',
      description: 'Renders a link when a destination is supplied.',
    },
    external: {
      control: 'boolean',
      description: 'Adds the external-link icon to a link.',
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'tint', 'neutral', 'outline', 'text'],
    },
    size: { control: 'inline-radio', options: ['default', 'touch', 'compact'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Tint: Story = {
  args: { variant: 'tint', children: 'Ask', leadingIcon: 'message' },
};
export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Done', trailingIcon: 'check' },
};
export const Text: Story = {
  args: { variant: 'text', size: 'compact', children: 'Undo' },
};
export const Touch: Story = {
  args: { size: 'touch', variant: 'neutral', children: 'Done' },
};
export const ExternalLink: Story = {
  args: {
    href: 'https://mail.google.com/',
    external: true,
    target: '_blank',
    rel: 'noreferrer',
  },
};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
export const Pressed: Story = { parameters: { pseudo: { active: true } } };
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
export const DisabledExternalLink: Story = {
  args: { ...ExternalLink.args, disabled: true },
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link');
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).not.toHaveAttribute('href');
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Snooze' },
};
export const OutlineHover: Story = {
  ...Outline,
  parameters: { pseudo: { hover: true } },
};
export const OutlinePressed: Story = {
  ...Outline,
  parameters: { pseudo: { active: true } },
};
export const OutlineFocus: Story = {
  ...Outline,
  parameters: { pseudo: { focusVisible: true } },
};
export const OutlineDisabled: Story = {
  ...Outline,
  args: { ...Outline.args, disabled: true },
};
export const OutlineKeyboard: Story = {
  ...Outline,
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Snooze' });
    await expect(button.getBoundingClientRect().height).toBe(40);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
