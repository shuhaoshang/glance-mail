import { FoundationPage } from '../../foundations/catalog';
import styles from '../FactExamples.module.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, fn, waitFor } from 'storybook/test';
import { Field } from './Field';
import { FieldExample, FieldStatesExample } from '../FactExamples';
import { factSamples, plainField } from '../factSamples';

const meta = {
  title: 'Primitives/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          '[Field specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#field). The enclosing item supplies the fact ID, kind, and selection handler. Hover and press use fact-palette aliases. Selected ink takes precedence.',
      },
    },
  },
  args: {
    ...factSamples.money.field,
    value: factSamples.money.field.value,
    fact: factSamples.money.fact.id,
    kind: 'money',
    onSelect: fn(),
    size: 'default',
    selected: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    label: { control: false },
    value: { control: false },
    fact: { control: false },
    kind: { control: false },
    onSelect: { control: false },
  },
  render: (args) => (
    <FieldExample
      key={String(args.selected)}
      sample={factSamples.money}
      size={args.size}
      initiallyOpen={args.selected}
    />
  ),
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = {
  parameters: { pseudo: { hover: 'button[aria-expanded]' } },
};
export const Pressed: Story = {
  parameters: { pseudo: { active: 'button[aria-expanded]' } },
};
export const SelectedHover: Story = {
  args: { selected: true },
  parameters: { pseudo: { hover: 'button[aria-expanded]' } },
};
export const SelectedPressed: Story = {
  args: { selected: true },
  parameters: { pseudo: { active: 'button[aria-expanded]' } },
};
export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: 'button[aria-expanded]' } },
};
export const Selected: Story = { args: { selected: true } };
export const Small: Story = { args: { size: 'small' } };
export const Large: Story = { args: { size: 'large' } };
export const Time: Story = {
  render: (args) => <FieldExample sample={factSamples.time} size={args.size} />,
};
export const People: Story = {
  render: (args) => (
    <FieldExample sample={factSamples.people} size={args.size} />
  ),
};
export const WithoutSource: Story = {
  render: (args) => <Field {...plainField} fact={undefined} size={args.size} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Reply C')).toBeVisible();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};
export const KeyboardSource: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Contract: $48,000/yr. Show where the email says so',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const panel = await canvas.findByRole('region', {
      name: 'Source from ' + factSamples.money.item.from,
    });
    await waitFor(async () => {
      await expect(panel).toBeVisible();
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls'),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(' ');
    const reopened = await canvas.findByRole('region', {
      name: 'Source from ' + factSamples.money.item.from,
    });
    await waitFor(async () => {
      await expect(reopened).toBeVisible();
    });
  },
};

export const States: Story = {
  parameters: {
    layout: 'fullscreen',
    pseudo: {
      hover: '[data-field-state="Hover"] button[aria-expanded]',
      active: '[data-field-state="Pressed"] button[aria-expanded]',
      focusVisible: '[data-field-state="Focus"] button[aria-expanded]',
    },
  },
  render: () => (
    <FoundationPage
      title="Field states"
      description="Compare all five states for each fact type. Selected ink keeps its color during hover and press."
    >
      {Object.values(factSamples).map((sample) => (
        <section className={styles.sheet} key={sample.fact.kind}>
          <h2>{sample.fact.kind}</h2>
          <FieldStatesExample sample={sample} />
        </section>
      ))}
    </FoundationPage>
  ),
};
