import type { Meta, StoryObj } from '@storybook/react-vite';
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
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          'The desktop detail card currently contains its position, title, sender, account label, and attributed request. Task 08 adds the remaining detail content inside this card.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={styles.preview}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Daniel: Story = {};
export const Maya: Story = {
  args: {
    item: visibleItems(maya)[0],
    total: visibleItems(maya).length,
    account: maya.accounts[0],
  },
};
export const Sarah: Story = {
  args: {
    item: visibleItems(sarah)[0],
    total: visibleItems(sarah).length,
    account: sarah.accounts.find(
      (account) => account.id === visibleItems(sarah)[0].account,
    ),
  },
};
export const Summary: Story = {
  args: { item: visibleItems(daniel)[2], position: 3 },
};
