import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SceneCard } from './SceneCard';
import { SceneExample } from './SceneExample';
import { sceneSamples } from './sceneSamples';
import styles from './SceneExample.module.css';

type Args = ComponentProps<typeof SceneCard> &
  Pick<
    ComponentProps<typeof SceneExample>,
    'account' | 'initialField' | 'narrow'
  >;
const meta = {
  title: 'Scene cards/SceneCard',
  component: SceneCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '[Scene card specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#5-scene-cards). The type comes only from the supplied scene. Field selection is controlled by its field key; checklist progress stays local.',
      },
    },
  },
  args: {
    ...sceneSamples.Deal,
    onSelectFact: fn(),
    onChecklistCompleteChange: fn(),
  },
  argTypes: {
    selectedField: { control: false },
    sourcePanelId: { control: false },
    item: { control: false },
    account: { control: false },
  },
  render: ({
    item,
    account,
    initialField,
    narrow,
    mobile,
    onSelectFact,
    onChecklistCompleteChange,
  }) => (
    <SceneExample
      key={item.id}
      {...{
        item,
        account,
        initialField,
        narrow,
        mobile,
        onSelectFact,
        onChecklistCompleteChange,
      }}
    />
  ),
  decorators: [
    (Story, context) => (
      <div
        className={[
          styles.canvas,
          context.args.narrow && styles.narrowCanvas,
          context.parameters.phoneCanvas && styles.phoneCanvas,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Deal: Story = {};
export const NewLead: Story = { args: sceneSamples.NewLead };
export const Decision: Story = { args: sceneSamples.Decision };
export const Approval: Story = { args: sceneSamples.Approval };
export const Payment: Story = { args: sceneSamples.Payment };
export const Mismatch: Story = { args: sceneSamples.Mismatch };
export const Event: Story = { args: sceneSamples.Event };
export const Range: Story = { args: sceneSamples.Range };
export const Checklist: Story = { args: sceneSamples.Checklist };
export const TextFallback: Story = { args: sceneSamples.Text };
export const MissingScene: Story = {
  args: {
    ...sceneSamples.Text,
    item: { ...sceneSamples.Text.item, scene: undefined },
  },
};
export const UnknownScene: Story = {
  args: {
    ...sceneSamples.Text,
    item: { ...sceneSamples.Text.item, scene: { type: 'unrecognized' } },
  },
};
export const FieldSelected: Story = {
  args: { initialField: { fieldKey: 'fields.0', factId: 'f2' } },
};
export const LongValues: Story = {
  args: { ...sceneSamples.NewLead, narrow: true },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const SourceInteraction: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole('button', {
      name: 'Contract: $48,000/yr. Show where the email says so',
    });
    field.focus();
    await userEvent.keyboard('{Enter}');
    await expect(field).toHaveAttribute('aria-expanded', 'true');
    await waitFor(async () => {
      await expect(
        canvas.getByRole('region', { name: 'Source from Priya Shah' }),
      ).toBeVisible();
    });
    const next = canvas.getByRole('button', {
      name: 'Renews: Nov 15. Show where the email says so',
    });
    await userEvent.click(next);
    await expect(field).toHaveAttribute('aria-expanded', 'false');
    await expect(next).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getAllByRole('region', { name: 'Source from Priya Shah' }),
    ).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await expect(next).toHaveFocus();
    await expect(next).toHaveAttribute('aria-expanded', 'false');
  },
};
export const SharedSourceSelection: Story = {
  args: sceneSamples.Mismatch,
  play: async ({ canvas }) => {
    const billed = canvas.getByRole('button', {
      name: 'Billed: 52 seats. Show where the email says so',
    });
    const used = canvas.getByRole('button', {
      name: 'In use: 48 seats. Show where the email says so',
    });
    await userEvent.click(billed);
    await expect(billed).toHaveAttribute('aria-expanded', 'true');
    await expect(used).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(used);
    await expect(billed).toHaveAttribute('aria-expanded', 'false');
    await expect(used).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(used);
    await expect(used).toHaveAttribute('aria-expanded', 'false');
    await expect(
      canvas.queryByRole('button', { name: 'Close source' }),
    ).not.toBeInTheDocument();
  },
};
export const CompletedChecklist: Story = {
  args: sceneSamples.Checklist,
  play: async ({ canvas }) => {
    for (const box of canvas.getAllByRole('checkbox'))
      await userEvent.click(box);
    const scene = sceneSamples.Checklist.item.scene;
    if (scene.type !== 'checklist')
      throw new Error('Missing checklist sample.');
    await expect(canvas.getByRole('status')).toHaveTextContent(scene.doneNote!);
  },
};
export const ChecklistInteraction: Story = {
  args: sceneSamples.Checklist,
  play: async ({ canvas, args }) => {
    const boxes = canvas.getAllByRole('checkbox');
    const fact = canvas.getByRole('button', {
      name: '$12. Show where the email says so',
    });
    await userEvent.click(fact);
    await expect(boxes[1]).not.toBeChecked();
    await waitFor(async () => {
      await expect(
        canvas.getByRole('region', { name: 'Source from Ms. Rivera' }),
      ).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await userEvent.click(
      canvas.getByText('Sign the permission slip', { exact: true }),
    );
    boxes[1].focus();
    await userEvent.keyboard(' ');
    for (const box of boxes) await expect(box).toBeChecked();
    await expect(canvas.getByRole('status')).toBeVisible();
    await expect(args.onChecklistCompleteChange).toHaveBeenLastCalledWith(true);
    await expect(canvas.getByRole('region', { name: 'To do' })).toBeVisible();
    await userEvent.click(fact);
    await expect(boxes[1]).toBeChecked();
    await expect(fact).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(boxes[0]);
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await expect(args.onChecklistCompleteChange).toHaveBeenLastCalledWith(
      false,
    );
  },
};
export const FallbackInteraction: Story = {
  args: {
    ...sceneSamples.Text,
    item: { ...sceneSamples.Text.item, scene: { type: 'unrecognized' } },
  },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Facts from the email' });
    const fields = within(list).getAllByRole('button');
    await expect(fields).toHaveLength(sceneSamples.Text.item.facts.length);
    await expect(
      canvas.queryByRole('region', { name: 'Renewal' }),
    ).not.toBeInTheDocument();
    fields[0].focus();
    await userEvent.keyboard('{Enter}');
    await expect(fields[0]).toHaveAttribute('aria-expanded', 'true');
    await waitFor(async () => {
      await expect(
        canvas.getByRole('region', { name: 'Source from Ana Ruiz' }),
      ).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await expect(fields[0]).toHaveFocus();
  },
};

export const PhoneChecklist: Story = {
  args: {
    ...sceneSamples.Checklist,
    initialField: { fieldKey: 'steps.1', factId: 'f2' },
  },
  parameters: { layout: 'fullscreen', phoneCanvas: true },
};

export const PhoneDecision: Story = {
  args: { ...sceneSamples.Decision, mobile: true },
  parameters: { layout: 'fullscreen', phoneCanvas: true },
};
