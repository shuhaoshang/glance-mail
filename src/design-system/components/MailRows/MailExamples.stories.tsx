import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MailExample, MovedRows, EmptyExamples } from './MailExamples';
const meta = {
  title: 'Composites/Mail rows and details',
  component: MailExample,
  parameters: { layout: 'fullscreen' },
  args: { kind: 'heads-up', personaId: 'maya' },
} satisfies Meta<typeof MailExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const MayaHeadsUp: Story = {};
export const MayaSecond: Story = { args: { index: 1 } };
export const Brightline: Story = { args: { index: 2 } };
export const DanielPersonal: Story = {
  args: { personaId: 'daniel', index: 2 },
};
export const MayaOtherMail: Story = { args: { kind: 'other-mail' } };
export const Promotion: Story = { args: { kind: 'other-mail', index: 3 } };
export const OriginalEmail: Story = { args: { initialEmail: true } };
export const NeedsYou: Story = { args: { kind: 'needs-you' } };
export const MovedIntoNeedsYou: Story = {
  args: { kind: 'other-mail', movedTo: 'Needs you' },
};
export const MovedIntoHeadsUp: Story = {
  args: { kind: 'needs-you', movedTo: 'Heads-up' },
};
export const MovedIntoOtherMail: Story = { args: { movedTo: 'Other mail' } };
export const MovedMatrix: Story = { render: () => <MovedRows /> };
export const Empty: Story = { render: () => <EmptyExamples /> };
export const Hover: Story = {
  parameters: { pseudo: { hover: '[role="listitem"] button' } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: '[role="listitem"] button' } },
};
export const Focus: Story = {
  parameters: {
    pseudo: { focusVisible: '[role="listitem"] button:first-child' },
  },
};
export const Dark: Story = { globals: { theme: 'dark' } };
export const SourcesAndRead: Story = {
  args: { index: 2 },
  play: async ({ canvas }) => {
    const row = within(
      canvas.getByRole('list', { name: 'Heads-up' }),
    ).getByRole('button', { name: /Brightline/ });
    await userEvent.click(row);
    await expect(
      canvas.getByRole('region', {
        name: 'Source from Brightline admin report',
      }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: 'Close source' }),
    ).not.toBeInTheDocument();
    const why = canvas.getByRole('button', {
      name: 'Why it’s here: Upsell signal',
    });
    await userEvent.click(why);
    await expect(
      canvas.getByRole('region', { name: 'Glance’s read' }),
    ).toHaveTextContent('Brightline is close to its seat limit');
    await userEvent.keyboard('{Escape}');
    await expect(why).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Open email' }));
    await expect(
      canvas.getByRole('tab', { name: 'Original email' }),
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('tab', { name: 'Details' })).toHaveFocus();
  },
};
export const PhoneHeadsUp: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Heads-up' })).getAllByRole(
        'button',
      )[0],
    );
  },
};
export const PhoneOtherMail: Story = {
  args: Promotion.args,
  play: async ({ canvas }) => {
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Other mail' })).getAllByRole(
        'button',
      )[3],
    );
  },
};
export const PhoneNeedsYou: Story = {
  args: NeedsYou.args,
  play: async ({ canvas }) => {
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Needs you' })).getAllByRole(
        'button',
      )[0],
    );
  },
};

export const JudgmentOnly: Story = {
  args: { kind: 'other-mail', personaId: 'daniel' },
};
