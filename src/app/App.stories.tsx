import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../data';
import { App } from './App';

const meta = {
  title: 'Patterns/Brief',
  tags: ['!autodocs'],
  component: App,
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya', startClean: true },
  argTypes: {
    personaId: { control: 'select', options: ['maya', 'daniel', 'sarah'] },
  },
} satisfies Meta<typeof App>;
export default meta;
type Story = StoryObj<typeof meta>;

const verifyBrief: NonNullable<Story['play']> = async ({ canvas, args }) => {
  const persona = getPersona(args.personaId);
  const items = persona.items.filter((item) => !item.isNew);
  await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  await expect(
    canvas.getByRole('heading', { name: persona.greeting }),
  ).toBeVisible();
  await expect(
    canvas.getByText(
      persona.coverage.text.replace('{n}', String(persona.coverage.emails)),
    ),
  ).toBeVisible();
  for (const [label, count] of [
    ['Needs you', items.length],
    ['Heads-up', persona.goodToKnow.length],
    ['Other mail', persona.otherMail.total],
  ])
    await expect(
      canvas.getByRole('tab', { name: label + ' ' + count }),
    ).toBeVisible();
  const needs = within(canvas.getByRole('list', { name: 'Needs you' }));
  const rows = items.map((item) =>
    needs.getByRole('button', { name: new RegExp(item.name) }),
  );
  const desktop = !!canvas.queryByRole('region', { name: 'Selected item' });
  await expect(rows[0]).toHaveAttribute('aria-pressed', String(desktop));
  const tab = canvas.getByRole('tab', { name: 'Needs you ' + items.length });
  tab.focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(
    canvas.getByRole('tab', { name: 'Heads-up ' + persona.goodToKnow.length }),
  ).toHaveFocus();
  await expect(canvas.getByRole('list', { name: 'Heads-up' })).toBeVisible();
  await userEvent.keyboard('{Home}');
  await userEvent.tab();
  // Maya's new-mail action comes before her first row.
  if (persona.newMail) await userEvent.tab();
  await expect(rows[0]).toHaveFocus();
  await userEvent.tab();
  await expect(rows[1]).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  const detail = within(canvas.getByRole('region', { name: 'Selected item' }));
  await expect(
    detail.getByRole('heading', { name: items[1].name }),
  ).toBeVisible();
  await expect(
    detail.getByText('Needs you · 2 of ' + items.length),
  ).toBeVisible();
  await userEvent.click(detail.getByRole('tab', { name: 'Original email' }));
  await userEvent.click(detail.getByRole('switch', { name: 'Highlighter' }));
  if (!desktop) {
    await userEvent.click(detail.getByRole('button', { name: 'Close detail' }));
    await waitFor(() =>
      expect(canvas.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await expect(rows[1]).toHaveFocus();
  }
  await userEvent.click(
    canvas.getByRole('tab', { name: 'Other mail ' + persona.otherMail.total }),
  );
  await expect(canvas.getByRole('list', { name: 'Other mail' })).toBeVisible();
  await userEvent.click(tab);
  if (!desktop) await userEvent.click(rows[1]);
  const restored = within(
    canvas.getByRole('region', { name: 'Selected item' }),
  );
  await expect(
    restored.getByRole('tab', { name: 'Original email' }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(
    restored.getByRole('switch', { name: 'Highlighter' }),
  ).not.toBeChecked();
};
export const Maya: Story = {};
export const Daniel: Story = { args: { personaId: 'daniel' } };
export const Sarah: Story = { args: { personaId: 'sarah' } };
export const KeyboardMaya: Story = { play: verifyBrief };
export const KeyboardDaniel: Story = { ...Daniel, play: verifyBrief };
export const KeyboardSarah: Story = { ...Sarah, play: verifyBrief };

const showTab =
  (
    label: 'Heads-up' | 'Other mail',
    open = false,
  ): NonNullable<Story['play']> =>
  async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('tab', { name: new RegExp('^' + label + ' ') }),
    );
    if (open)
      await userEvent.click(
        within(canvas.getByRole('list', { name: label })).getAllByRole(
          'button',
        )[0],
      );
  };
export const HeadsUp: Story = { play: showTab('Heads-up') };
export const OtherMail: Story = { play: showTab('Other mail') };
export const HeadsUpDetail: Story = { play: showTab('Heads-up', true) };
export const OtherMailDetail: Story = { play: showTab('Other mail', true) };
export const DanielHeadsUp: Story = { ...Daniel, play: showTab('Heads-up') };
export const SarahOtherMail: Story = { ...Sarah, play: showTab('Other mail') };
