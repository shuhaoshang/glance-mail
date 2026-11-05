import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../data';
import { App } from './App';

const meta = {
  title: 'Patterns/Brief',
  tags: ['!autodocs'],
  component: App,
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya' },
  argTypes: {
    personaId: { control: 'select', options: ['maya', 'daniel', 'sarah'] },
  },
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

const verifyBrief: NonNullable<Story['play']> = async ({ canvas, args }) => {
  const persona = getPersona(args.personaId);
  const items = persona.items.filter((item) => !item.isNew);
  const done = persona.doneBefore.length;
  const aside = persona.setAside.reduce((sum, group) => sum + group.count, 0);
  const covered = items.length + persona.goodToKnow.length + aside + done;

  await expect(covered).toBe(persona.coverage.emails);
  await expect(
    canvas.getByRole('heading', { name: persona.greeting }),
  ).toBeVisible();
  await expect(
    canvas.getByText(persona.coverage.text.replace('{n}', String(covered)), {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('heading', {
      name: new RegExp('^Needs you\\s+' + items.length + '$'),
    }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('heading', {
      name: new RegExp('^Good to know\\s+' + persona.goodToKnow.length + '$'),
    }),
  ).toBeVisible();
  await expect(
    within(canvas.getByRole('list', { name: 'Good to know' })).getAllByRole(
      'listitem',
    ),
  ).toHaveLength(persona.goodToKnow.length);
  await expect(
    canvas.getByRole('heading', {
      name: new RegExp('^Set aside\\s+' + aside + '$'),
    }),
  ).toBeVisible();
  await expect(
    canvas.getByText(done + ' of ' + (items.length + done) + ' done', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    canvas.queryByRole('button', { name: /^Undo/ }),
  ).not.toBeInTheDocument();

  const needs = within(canvas.getByRole('list', { name: 'Needs you' }));
  const rows = items.map((item) =>
    needs.getByRole('button', { name: new RegExp(item.name) }),
  );
  await expect(needs.getAllByRole('button')).toEqual(rows);
  for (const item of persona.items.filter((item) => item.isNew)) {
    await expect(
      needs.queryByRole('button', { name: new RegExp(item.name) }),
    ).not.toBeInTheDocument();
  }

  rows[0].focus();
  for (const row of rows.slice(1)) {
    await userEvent.tab();
    await expect(row).toHaveFocus();
  }
  rows[1].focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(async () => {
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'true');
  });
  await expect(needs.getAllByRole('button')).toEqual(rows);
  await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();

  const detail = canvas.queryByRole('region', { name: 'Selected item' });
  if (detail) {
    await expect(
      within(detail).getByText(items[1].name, { exact: true }),
    ).toBeVisible();
    await expect(
      within(detail).getByText(items[1].request.text, { exact: true }),
    ).toBeVisible();
    await expect(within(detail).queryByRole('button')).not.toBeInTheDocument();
  }
};

export const Maya: Story = {};
export const Daniel: Story = { args: { personaId: 'daniel' } };
export const Sarah: Story = { args: { personaId: 'sarah' } };

export const KeyboardMaya: Story = { play: verifyBrief };
export const KeyboardDaniel: Story = {
  args: { personaId: 'daniel' },
  play: verifyBrief,
};
export const KeyboardSarah: Story = {
  args: { personaId: 'sarah' },
  play: verifyBrief,
};
