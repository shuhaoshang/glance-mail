import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../../data';
import { Text } from './Text';

const maya = getPersona('maya');
const renewal = maya.items[0];
const deadline = renewal.facts[0];
const { pre, hl, post } = deadline.source;

const meta = {
  title: 'Primitives/Text',
  component: Text,
  args: {
    variant: 'body',
    as: 'p',
    children: maya.coverage.text.replace('{n}', String(maya.coverage.emails)),
  },
  argTypes: {
    children: { control: 'text', table: { type: { summary: 'ReactNode' } } },
    className: { control: 'text', table: { type: { summary: 'string' } } },
  },
  parameters: {
    docs: {
      description: {
        component:
          '[Text styles in the design system](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#text-styles)',
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Display: Story = {
  args: { variant: 'display', as: 'h1', children: maya.greeting },
};
export const Greeting: Story = {
  args: { variant: 'greeting', as: 'h1', children: maya.greeting },
};
export const Request: Story = {
  args: { variant: 'request', children: renewal.request.text },
};
export const Title: Story = {
  args: { variant: 'title', as: 'h2', children: renewal.name },
};
export const Section: Story = {
  args: { variant: 'section', as: 'h2', children: 'Needs you' },
};
export const Reading: Story = {
  args: { variant: 'reading', children: pre + hl + post },
};
export const MetaText: Story = {
  name: 'Meta',
  args: { variant: 'meta', children: [renewal.from, renewal.when].join(' · ') },
};
export const Chip: Story = {
  args: { variant: 'chip', as: 'span', children: deadline.label },
};
