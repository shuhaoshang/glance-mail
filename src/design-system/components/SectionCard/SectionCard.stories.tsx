import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SectionCard } from './SectionCard';
import { BriefRow } from '../BriefRow/BriefRow';
import { maya } from '../listSamples';
const meta = {
  title: 'Composites/SectionCard',
  component: SectionCard,
  parameters: {
    docs: {
      description: {
        component:
          'A section heading and list panel with the shared panel shadow. The existing desktop padding and phone dividers remain.',
      },
    },
  },
  args: {
    title: 'Needs you',
    count: maya.items.filter((i) => !i.isNew).length,
    rightSlot: 'Most urgent first',
    children: maya.items
      .filter((i) => !i.isNew)
      .map((item, index) => (
        <BriefRow key={item.id} item={item} rank={index + 1} onSelect={fn()} />
      )),
  },
} satisfies Meta<typeof SectionCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const AccountSlot: Story = { args: { rightSlot: 'From Gmail only' } };
export const WithoutSlot: Story = { args: { rightSlot: undefined } };
