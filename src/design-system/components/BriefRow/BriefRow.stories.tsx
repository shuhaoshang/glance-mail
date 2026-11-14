import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent } from 'storybook/test';
import { BriefRow } from './BriefRow';
import { SectionCard } from '../SectionCard/SectionCard';
import { CollapseExample } from '../ListExamples';
import { FoundationPage } from '../../foundations/catalog';
import { maya, sarah, newItem, personas } from '../listSamples';
import styles from '../ListExamples.module.css';
const meta = {
  title: 'Composites/BriefRow',
  component: BriefRow,
  args: { item: maya.items[0], rank: 1, onSelect: fn() },
  decorators: [
    (Story, { parameters }) =>
      parameters.layout === 'fullscreen' ? (
        <Story />
      ) : (
        <div className={styles.list}>
          <SectionCard title="Needs you" count={1}>
            <Story />
          </SectionCard>
        </div>
      ),
  ],
} satisfies Meta<typeof BriefRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hover: Story = {
  parameters: { pseudo: { hover: 'button[aria-pressed]' } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: 'button[aria-pressed]' } },
};
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'button[aria-pressed]' } },
};
export const Selected: Story = { args: { selected: true } };
export const SelectedHover: Story = {
  args: { selected: true },
  parameters: { pseudo: { hover: 'button[aria-pressed]' } },
};
export const Summary: Story = {
  args: { item: sarah.items[0], account: sarah.accounts[1] },
};
export const New: Story = { args: { item: newItem } };
export const Leaving: Story = {
  decorators: [],
  render: () => <CollapseExample />,
};
export const AllPersonas: Story = {
  decorators: [],
  parameters: { layout: 'fullscreen' },
  render: () => (
    <FoundationPage
      title="Every supplied item"
      description="One BriefRow handles every item, including the new-mail example."
    >
      <div className={styles.states}>
        {personas.map((persona) => (
          <SectionCard
            key={persona.id}
            title={persona.name}
            count={persona.items.length}
          >
            {persona.items.map((item, index) => (
              <BriefRow
                key={item.id}
                item={item}
                rank={index + 1}
                account={persona.accounts.find((a) => a.id === item.account)}
                onSelect={fn()}
              />
            ))}
          </SectionCard>
        ))}
      </div>
    </FoundationPage>
  ),
};
export const KeyboardSelection: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith(args.item.id, button);
    if ('moved' in args.item)
      throw new Error('This story requires a supplied Needs you item.');
    await expect(canvas.getByText(args.item.request.text)).toBeVisible();
    await expect(canvas.getAllByText(/^(time|money|people):$/)).toHaveLength(
      Math.min(2, args.item.facts.length),
    );
    await expect(
      canvas.queryByRole('button', { name: 'New' }),
    ).not.toBeInTheDocument();
  },
};
export const States: Story = {
  decorators: [],
  parameters: {
    layout: 'fullscreen',
    pseudo: {
      hover:
        '[data-row-state="Hover"] button[aria-pressed], [data-row-state="Selected hover"] button[aria-pressed]',
      active:
        '[data-row-state="Pressed"] button[aria-pressed], [data-row-state="Selected pressed"] button[aria-pressed]',
      focusVisible: '[data-row-state="Focus"] button[aria-pressed]',
    },
  },
  render: () => (
    <FoundationPage
      title="BriefRow states"
      description="Unselected rows change fill on hover and press. Selected rows keep their surface, ring, and shadow. Keyboard focus adds the outline."
    >
      <div className={styles.states}>
        {[
          'Default',
          'Hover',
          'Pressed',
          'Focus',
          'Selected',
          'Selected hover',
          'Selected pressed',
          'New',
        ].map((state) => (
          <div className={styles.specimen} key={state} data-row-state={state}>
            <h2>{state}</h2>
            <SectionCard title="Needs you" count={1}>
              <BriefRow
                item={state === 'New' ? newItem : maya.items[0]}
                rank={1}
                selected={state.startsWith('Selected')}
                onSelect={fn()}
              />
            </SectionCard>
          </div>
        ))}
      </div>
    </FoundationPage>
  ),
};

export const LongRequest: Story = {
  args: {
    item: personas
      .flatMap((persona) => persona.items)
      .reduce(
        (longest, item) =>
          item.request.text.length > longest.request.text.length
            ? item
            : longest,
        maya.items[0],
      ),
  },
};

export const SelectedPressed: Story = {
  args: { selected: true },
  parameters: { pseudo: { active: true } },
};

export const Revealed: Story = {
  args: { onSelect: fn() },
  render: ({ onSelect }) => (
    <BriefRow
      item={{
        id: 'lincoln-class-party',
        name: 'Lincoln Elementary',
        request: {
          type: 'summary',
          text: 'Send a snack for Friday’s class party',
        },
        facts: [
          {
            id: 'party-date',
            kind: 'time',
            label: 'Fri, Nov 20',
            urgent: false,
          },
        ],
      }}
      rank={5}
      account={sarah.accounts[1]}
      entering
      onSelect={onSelect}
    />
  ),
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: /Lincoln Elementary/ });
    await expect(button).toHaveTextContent('Fri, Nov 20');
    await expect(button).not.toHaveTextContent(/\bNew\b/);
    await userEvent.click(button);
    await expect(args.onSelect).toHaveBeenCalledWith(
      'lincoln-class-party',
      button,
    );
  },
};
