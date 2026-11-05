import { fn } from 'storybook/test';
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
