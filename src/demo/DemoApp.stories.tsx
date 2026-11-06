import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona, type PersonaId } from '../data';
import { DemoApp, type DemoLevel } from './DemoApp';

const meta = {
  title: 'Patterns/Demo',
  tags: ['!autodocs'],
  component: DemoApp,
  parameters: { layout: 'fullscreen' },
  args: {
    initialPersonaId: 'maya',
    initialLevel: 3,
    syncUrl: false,
  },
  argTypes: {
    initialPersonaId: {
      control: 'select',
      options: ['maya', 'daniel', 'sarah'],
    },
    initialLevel: { control: 'inline-radio', options: [1, 2, 3] },
    syncUrl: { control: false, table: { disable: true } },
  },
  render: (args) => (
    <DemoApp
      key={args.initialPersonaId + '-' + args.initialLevel}
      {...args}
      syncUrl={false}
    />
  ),
} satisfies Meta<typeof DemoApp>;

export default meta;
type Story = StoryObj<typeof meta>;

const personaLabels: Record<PersonaId, string> = {
  maya: 'Maya · Sales',
  daniel: 'Daniel · Manager',
  sarah: 'Sarah · Parent',
};
const levelLabels: Record<DemoLevel, string> = {
  1: '1 Plain AI text',
  2: '2 Formatted',
  3: '3 Glance',
};

const openControls: NonNullable<Story['play']> = async ({ canvas }) => {
  const trigger = canvas.queryByRole('button', { name: 'Demo' });
  if (trigger && trigger.getAttribute('aria-expanded') === 'false') {
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
};

export const Glance: Story = {};
export const Plain: Story = { args: { initialLevel: 1 } };
export const Formatted: Story = { args: { initialLevel: 2 } };
export const Daniel: Story = { args: { initialPersonaId: 'daniel' } };
export const Sarah: Story = { args: { initialPersonaId: 'sarah' } };
export const Expanded: Story = { play: openControls };
export const Hover: Story = {
  parameters: {
    pseudo: { hover: '[aria-label="Demo persona"] button:nth-child(2)' },
  },
  play: openControls,
};
export const Pressed: Story = {
  parameters: {
    pseudo: {
      hover: '[aria-label="Demo persona"] button:nth-child(2)',
      active: '[aria-label="Demo persona"] button:nth-child(2)',
    },
  },
  play: openControls,
};
export const FocusVisible: Story = {
  parameters: {
    pseudo: {
      focusVisible: '[aria-label="Demo level"] button[aria-pressed="true"]',
    },
  },
  play: openControls,
};

export const PersonaAndLevelSelection: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.queryByRole('button', {
      name: 'Demo',
    });
    if (trigger) {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    }

    const personaGroup = () =>
      within(canvas.getByRole('group', { name: 'Demo persona' }));
    const levelGroup = () =>
      within(canvas.getByRole('group', { name: 'Demo level' }));
    let currentPersona: PersonaId = args.initialPersonaId ?? 'maya';

    async function checkSelection(personaId: PersonaId, level: DemoLevel) {
      await waitFor(async () => {
        await expect(
          personaGroup().getByRole('button', {
            name: personaLabels[personaId],
          }),
        ).toHaveAttribute('aria-pressed', 'true');
        await expect(
          levelGroup().getByRole('button', {
            name: levelLabels[level],
          }),
        ).toHaveAttribute('aria-pressed', 'true');
        await expect(
          canvas.getByRole('heading', {
            name: getPersona(personaId).greeting,
          }),
        ).toBeVisible();
      });
      await expect(
        personaGroup().getAllByRole('button', { pressed: true }),
      ).toHaveLength(1);
      await expect(
        levelGroup().getAllByRole('button', { pressed: true }),
      ).toHaveLength(1);
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    }

    async function checkText(personaId: PersonaId, level: DemoLevel) {
      const persona = getPersona(personaId);
      if (level === 3) {
        await expect(
          canvas.getByRole('list', { name: 'Needs you' }),
        ).toBeVisible();
        await expect(
          canvas.queryByRole('region', { name: 'Brief as plain text' }),
        ).not.toBeInTheDocument();
        await expect(
          canvas.queryByRole('region', { name: 'Brief as formatted text' }),
        ).not.toBeInTheDocument();
        return;
      }
      const text = within(
        canvas.getByRole('region', {
          name: level === 1 ? 'Brief as plain text' : 'Brief as formatted text',
        }),
      );
      await expect(
        canvas.queryByRole('list', { name: 'Needs you' }),
      ).not.toBeInTheDocument();
      await expect(
        canvas.queryByRole('region', { name: 'Selected item' }),
      ).not.toBeInTheDocument();
      await expect(text.queryByRole('button')).not.toBeInTheDocument();
      await expect(text.queryByRole('link')).not.toBeInTheDocument();
      if (level === 1) {
        await expect(text.getByText(persona.demo.levels.l1)).toBeVisible();
        return;
      }

      const formatted = persona.demo.levels.l2;
      const lists = text.getAllByRole('list');
      await expect(lists).toHaveLength(formatted.done.length ? 3 : 2);
      const needs = within(lists[0]).getAllByRole('listitem');
      await expect(needs).toHaveLength(formatted.needs.length);
      for (const [index, [lead, value]] of formatted.needs.entries()) {
        await expect(needs[index]).toHaveTextContent(lead + value);
        await expect(within(needs[index]).getByText(lead)).toBeVisible();
      }
      for (const value of [...formatted.know, ...formatted.done]) {
        await expect(text.getByText(value)).toBeVisible();
      }
      await expect(text.getByText(formatted.setAside)).toBeVisible();
      if (!formatted.done.length) {
        await expect(
          text.queryByRole('heading', { name: 'Done' }),
        ).not.toBeInTheDocument();
      }
    }

    for (const level of [1, 2, 3] as const) {
      await userEvent.click(
        levelGroup().getByRole('button', {
          name: levelLabels[level],
        }),
      );
      await checkSelection(currentPersona, level);
      for (const personaId of ['maya', 'daniel', 'sarah'] as const) {
        await userEvent.click(
          personaGroup().getByRole('button', {
            name: personaLabels[personaId],
          }),
        );
        currentPersona = personaId;
        await checkSelection(personaId, level);
        await checkText(personaId, level);
        if (trigger) {
          await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        }
      }
    }

    personaGroup().getByRole('button', { name: personaLabels.maya }).focus();
    await userEvent.keyboard(' ');
    await checkSelection('maya', 3);
    levelGroup().getByRole('button', { name: levelLabels[2] }).focus();
    await userEvent.keyboard('{Enter}');
    await checkSelection('maya', 2);

    if (trigger) {
      await userEvent.keyboard('{Escape}');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toHaveFocus();
      await expect(
        canvas.queryByRole('group', { name: 'Demo persona' }),
      ).not.toBeInTheDocument();
      await userEvent.keyboard(' ');
      await checkSelection('maya', 2);
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(
        canvas.queryByRole('group', { name: 'Demo level' }),
      ).not.toBeInTheDocument();
    }
  },
};
