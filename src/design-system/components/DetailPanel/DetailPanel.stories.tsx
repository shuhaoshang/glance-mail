import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../../../data';
import { DetailPanel } from './DetailPanel';
import styles from './DetailPanel.module.css';

const maya = getPersona('maya');
const daniel = getPersona('daniel');
const sarah = getPersona('sarah');
const visibleItems = (persona: typeof maya) =>
  persona.items.filter((item) => !item.isNew);

const meta = {
  title: 'Composites/DetailPanel',
  component: DetailPanel,
  args: {
    item: visibleItems(daniel)[0],
    position: 1,
    total: visibleItems(daniel).length,
    account: daniel.accounts.find(
      (account) => account.id === visibleItems(daniel)[0].account,
    )!,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The detail card combines attributed requests, scene cards, exact sources, Glance’s reasoning, and the original email. Its primary action opens the connected web inbox.',
      },
    },
  },
  decorators: [
    (Story) =>
      (
        <div className={styles.preview}>
          <Story />
        </div>
      )!,
  ],
} satisfies Meta<typeof DetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Daniel: Story = { args: { initialReasonOpen: true } };
export const Maya: Story = {
  args: {
    item: visibleItems(maya)[0],
    total: visibleItems(maya).length,
    account: maya.accounts[0],
    initialFactId: maya.items[0].facts[1].id,
  },
};
export const Sarah: Story = {
  args: {
    item: visibleItems(sarah)[0],
    total: visibleItems(sarah).length,
    account: sarah.accounts.find(
      (account) => account.id === visibleItems(sarah)[0].account,
    )!,
  },
};
export const MayaEmail: Story = { args: { ...Maya.args, initialTab: 'email' } };
export const DanielEmail: Story = { args: { initialTab: 'email' } };
export const SarahEmail: Story = {
  args: { ...Sarah.args, initialTab: 'email' },
};
export const Summary: Story = {
  args: { item: visibleItems(daniel)[2], position: 3 },
};

export const VerifySources: Story = {
  args: { ...Maya.args, initialFactId: undefined },
  play: async ({ canvas, args }) => {
    const fields = canvas.getAllByRole('button', {
      name: /Show where the email says so/,
    });
    await expect(fields.length).toBeGreaterThan(0);
    for (const [index, field] of fields.entries()) {
      await userEvent.click(field);
      const panelId = field.getAttribute('aria-controls')!;
      const source = document.getElementById(panelId);
      await waitFor(async () => {
        await expect(source).toBeVisible();
      });
      const selectedText = source?.querySelector('mark')?.textContent;
      const spec =
        args.item.scene?.type === 'deal'
          ? args.item.scene.fields[index]
          : undefined;
      await expect(selectedText).toBe(
        args.item.facts.find((fact) => fact.id === spec?.fact)?.source.hl,
      );
      const close = within(source as HTMLElement).getByRole('button', {
        name: /close/i,
      });
      await userEvent.click(close);
      await expect(field).toHaveFocus();
    }
    await userEvent.click(canvas.getByRole('tab', { name: 'Original email' }));
    await expect(
      canvas.getByRole('switch', { name: 'Highlighter' }),
    ).toBeChecked();
    await userEvent.click(canvas.getByRole('switch', { name: 'Highlighter' }));
    await userEvent.click(canvas.getByRole('tab', { name: /^Details$/ }));
    await userEvent.click(canvas.getByRole('tab', { name: 'Original email' }));
    await expect(
      canvas.getByRole('switch', { name: 'Highlighter' }),
    ).not.toBeChecked();
  },
};
export const PreserveChecklist: Story = {
  args: Sarah.args,
  play: async ({ canvas }) => {
    const checks = canvas.getAllByRole('checkbox');
    await userEvent.click(checks[0]);
    await userEvent.click(canvas.getByRole('tab', { name: 'Original email' }));
    await userEvent.click(canvas.getByRole('tab', { name: /^Details$/ }));
    await expect(canvas.getAllByRole('checkbox')[0]).toBeChecked();
    await expect(canvas.getAllByRole('checkbox')[1]).not.toBeChecked();
  },
};
