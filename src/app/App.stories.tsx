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
  const asideRegion = canvas.getByRole('region', { name: 'Set aside' });
  await expect(
    within(asideRegion).getByText(aside + ' set aside', { exact: true }),
  ).toBeVisible();
  await expect(
    within(asideRegion).queryByRole('button'),
  ).not.toBeInTheDocument();
  const hasDetail = !!canvas.queryByRole('region', { name: 'Selected item' });

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
  const dialog = hasDetail
    ? undefined
    : await canvas.findByRole('dialog', { name: items[1].name });
  const detail = within(
    dialog ?? canvas.getByRole('region', { name: 'Selected item' }),
  );
  await expect(
    detail.getByRole('heading', { name: items[1].name }),
  ).toBeVisible();
  await expect(
    detail.getByText(items[1].request.text, { exact: true }),
  ).toBeVisible();
  await expect(
    detail.getByText('Needs you · 2 of ' + items.length, { exact: true }),
  ).toBeVisible();
  const account =
    persona.accounts.find((entry) => entry.id === items[1].account) ??
    persona.accounts[0];
  const link = detail.getByRole('link', { name: 'Open in ' + account.app });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).not.toHaveAttribute('href', '#');
  await expect(
    detail.queryByRole('button', { name: /^Done$/ }),
  ).not.toBeInTheDocument();
  if (dialog) {
    await expect(dialog.contains(document.activeElement)).toBe(true);
    // Native Escape is checked in the browser; exercise its cancel event here.
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await waitFor(async () => {
      await expect(dialog).not.toHaveAttribute('open');
      await expect(rows[1]).toHaveFocus();
    });
    await expect(rows[1]).toHaveAttribute('aria-pressed', 'false');
  } else {
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(rows[1]).toHaveFocus();
    await userEvent.click(detail.getByRole('tab', { name: 'Original email' }));
    await userEvent.click(detail.getByRole('switch', { name: 'Highlighter' }));
    await userEvent.click(rows[1]);
    await expect(
      detail.getByRole('tab', { name: 'Original email' }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(
      detail.getByRole('switch', { name: 'Highlighter' }),
    ).not.toBeChecked();
  }
  await expect(needs.getAllByRole('button')).toEqual(rows);
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
