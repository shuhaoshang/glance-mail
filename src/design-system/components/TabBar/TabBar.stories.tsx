import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TabBar } from './TabBar';
import { TabBarExample } from './TabBarExample';
import { emailTabs, glanceTabs } from './tabSamples';

const meta = {
  title: 'Primitives/TabBar',
  component: TabBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Two named groups of count-bearing tabs on desktop; only the Email group is rendered on the phone. These controlled examples use supplied Maya data and simple preview panels. The application is not wired to this component yet. Each tab id identifies its panel; label that panel with the tab id plus "-tab". Unselected hover and press use the glass state token. Selected tabs keep their ink fill, count color, and shadow.',
      },
    },
  },
  args: {
    left: emailTabs,
    right: glanceTabs,
    selected: 'needs-you',
    onSelect: fn(),
  },
  argTypes: {
    selected: {
      control: 'select',
      options: [...emailTabs, ...glanceTabs].map((tab) => tab.id),
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <TabBarExample
        {...args}
        onSelect={(selected) => {
          args.onSelect(selected);
          updateArgs({ selected });
        }}
      />
    );
  },
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NeedsYou: Story = {};
export const HeadsUp: Story = { args: { selected: 'heads-up' } };
export const OtherMail: Story = { args: { selected: 'other-mail' } };
export const Watchlist: Story = { args: { selected: 'watchlist' } };
export const Memory: Story = { args: { selected: 'memory' } };
export const NewsUnselected: Story = {};
export const NewsSelected: Story = { ...Watchlist };
export const NoNews: Story = {
  args: { right: glanceTabs.map((tab) => ({ ...tab, hasNews: false })) },
};
export const LeftGroupOnly: Story = { args: { right: [] } };
export const Phone: Story = { args: { mobile: true } };
export const Dark: Story = { globals: { theme: 'dark' } };
export const Hover: Story = {
  parameters: { pseudo: { hover: '[role="tab"][aria-selected="false"]' } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: '[role="tab"][aria-selected="false"]' } },
};
export const FocusAdjacentHover: Story = {
  parameters: {
    pseudo: {
      focusVisible: '[role="tab"][aria-selected="true"]',
      hover: '[role="tablist"][aria-label="Email"] [role="tab"]:nth-child(2)',
    },
  },
};
export const SelectedHover: Story = {
  parameters: { pseudo: { hover: '[role="tab"][aria-selected="true"]' } },
};
export const SelectedPressed: Story = {
  parameters: { pseudo: { active: '[role="tab"][aria-selected="true"]' } },
};
export const KeyboardNavigation: Story = {
  play: async ({ canvas, args }) => {
    const email = within(canvas.getByRole('tablist', { name: 'Email' }));
    const needs = email.getByRole('tab', { name: 'Needs you 3' });
    needs.focus();
    await userEvent.keyboard('{ArrowLeft}');
    const other = email.getByRole('tab', { name: 'Other mail 31' });
    await expect(other).toHaveFocus();
    await expect(other).toHaveAttribute('aria-selected', 'true');
    await expect(
      canvas.getByRole('tabpanel', { name: 'Other mail 31' }),
    ).toBeVisible();
    await userEvent.keyboard('{ArrowRight}');
    await expect(needs).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(other).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(needs).toHaveFocus();
    const glance = canvas.queryByRole('tablist', { name: 'Glance' });
    await userEvent.tab();
    if (glance) {
      const watchlist = within(glance).getByRole('tab', {
        name: 'Watchlist 8, new',
      });
      await expect(watchlist).toHaveFocus();
      await expect(watchlist).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{ArrowLeft}');
      const memory = within(glance).getByRole('tab', { name: 'Memory 5' });
      await expect(memory).toHaveFocus();
      await expect(memory).toHaveAttribute('aria-selected', 'true');
      await expect(needs).toHaveAttribute('aria-selected', 'false');
      await userEvent.keyboard('{ArrowRight}');
      await expect(watchlist).toHaveFocus();
      await expect(watchlist).toHaveAttribute('aria-selected', 'true');
      await userEvent.tab();
      await expect(
        canvas.getByRole('tabpanel', { name: 'Watchlist 8, new' }),
      ).toHaveFocus();
    } else {
      await expect(
        canvas.getByRole('tabpanel', { name: 'Needs you 3' }),
      ).toHaveFocus();
    }
    await expect(args.onSelect).toHaveBeenCalled();
  },
};
export const PhoneKeyboard: Story = {
  ...KeyboardNavigation,
  args: { mobile: true },
};
export const SelectionAndNews: Story = {
  args: { mobile: false },
  play: async ({ canvas, args }) => {
    for (const tab of [...args.left, ...(args.right ?? [])]) {
      const name = tab.label + ' ' + tab.count + (tab.hasNews ? ', new' : '');
      const button = canvas.getByRole('tab', { name });
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-selected', 'true');
      const panel = canvas.getByRole('tabpanel', { name });
      await expect(panel).toHaveAttribute(
        'id',
        button.getAttribute('aria-controls'),
      );
      await expect(panel).toHaveAttribute('aria-labelledby', button.id);
      await expect(canvas.getAllByRole('tab', { selected: true })).toHaveLength(
        1,
      );
    }
  },
};
