import { expect, fn, userEvent } from 'storybook/test';
import { FoundationPage } from '../foundations/catalog';
import { SectionCard } from './SectionCard/SectionCard';
import { BriefRow } from './BriefRow/BriefRow';
import { CollapsedGroup } from './CollapsedGroup/CollapsedGroup';
import { maya, newItem } from './listSamples';
import styles from './ListExamples.module.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListOverview } from './ListExamples';
const meta = {
  title: 'Composites/List composites',
  component: ListOverview,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { personaId: 'maya' },
  argTypes: {
    personaId: {
      control: 'inline-radio',
      options: ['maya', 'daniel', 'sarah'],
    },
  },
} satisfies Meta<typeof ListOverview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
export const Daniel: Story = { args: { personaId: 'daniel' } };
export const Sarah: Story = { args: { personaId: 'sarah' } };

export const States: Story = {
  parameters: {
    pseudo: {
      hover:
        '[data-list-state="Hover"] button[aria-pressed], [data-list-state="Selected hover"] button[aria-pressed]',
      active:
        '[data-list-state="Pressed"] button[aria-pressed], [data-list-state="Selected pressed"] button[aria-pressed]',
      focusVisible: '[data-list-state="Focus"] button[aria-pressed]',
    },
  },
  render: () => (
    <FoundationPage
      title="List states"
      description="Compare row and Set aside feedback in the current theme. Selection keeps the brand tint; outlines identify keyboard focus."
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
        ].map((state) => (
          <div className={styles.specimen} data-list-state={state} key={state}>
            <h2>{state}</h2>
            <SectionCard title="Needs you" count={1}>
              <BriefRow
                item={maya.items[0]}
                rank={1}
                selected={state.startsWith('Selected')}
                onSelect={fn()}
              />
            </SectionCard>
            <CollapsedGroup
              groups={maya.setAside}
              selected={state.startsWith('Selected')}
              onSelect={fn()}
            />
          </div>
        ))}
      </div>
      <div className={styles.list}>
        <SectionCard title="New mail" count={1}>
          <BriefRow item={newItem} rank={1} onSelect={fn()} />
        </SectionCard>
      </div>
    </FoundationPage>
  ),
};

export const AdjacentRowFocus: Story = {
  parameters: {
    pseudo: {
      focusVisible: '[role="listitem"]:nth-child(2) button',
      hover: '[role="listitem"]:nth-child(3) button',
    },
  },
  render: () => (
    <FoundationPage
      title="Adjacent row focus"
      description="The first row is selected, the second has keyboard focus, and the third is hovered. The focus outline stays complete above both neighbors."
    >
      <div className={styles.list}>
        <SectionCard title="Needs you" count={3}>
          {maya.items
            .filter((item) => !item.isNew)
            .slice(0, 3)
            .map((item, index) => (
              <BriefRow
                key={item.id}
                item={item}
                rank={index + 1}
                selected={index === 0}
                onSelect={fn()}
              />
            ))}
        </SectionCard>
      </div>
    </FoundationPage>
  ),
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole('button');
    await expect(rows).toHaveLength(3);
    await expect(rows[0]).toHaveAttribute('aria-pressed', 'true');
    rows[0].focus();
    await userEvent.tab();
    await expect(rows[1]).toHaveFocus();
  },
};
