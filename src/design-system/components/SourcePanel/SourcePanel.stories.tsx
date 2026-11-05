import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, userEvent, waitFor } from 'storybook/test';
import { SourcePanel } from './SourcePanel';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { FieldExample } from '../FactExamples';
import { evidence, factSamples } from '../factSamples';
import styles from '../FactExamples.module.css';

function PanelExample(args: ComponentProps<typeof SourcePanel>) {
  const [open, setOpen] = useState(true);
  const [playback, setPlayback] = useState(0);
  const [email, setEmail] = useState(false);
  const item = Object.values(factSamples).find(
    (sample) => sample.item.from === args.from,
  )?.item;
  return (
    <div className={styles.example}>
      <div className={styles.row}>
        <Button
          variant="neutral"
          size="compact"
          onClick={() => {
            setOpen(true);
            setPlayback((value) => value + 1);
          }}
        >
          Replay source reveal
        </Button>
      </div>
      {open && (
        <SourcePanel
          {...args}
          key={playback}
          onOpenEmail={() => {
            args.onOpenEmail();
            setEmail(true);
          }}
          onClose={() => {
            args.onClose();
            setOpen(false);
          }}
        />
      )}
      {email && (
        <section aria-label="Original email example" className={styles.email}>
          <Text variant="meta">{args.from + ' · ' + args.when}</Text>
          <Text variant="reading" as="p">
            {item
              ? item.email.paras
                  .map((paragraph) =>
                    paragraph
                      .map((segment) =>
                        typeof segment === 'string' ? segment : segment.t,
                      )
                      .join(''),
                  )
                  .join('\n\n')
              : args.source.pre + args.source.hl + args.source.post}
          </Text>
          <Button variant="text" size="compact" onClick={() => setEmail(false)}>
            Close email example
          </Button>
        </section>
      )}
    </div>
  );
}
const meta = {
  title: 'Primitives/SourcePanel',
  component: SourcePanel,
  parameters: {
    docs: {
      description: {
        component:
          '[SourcePanel specification](https://github.com/shuhaoshang/glance-mail/blob/main/docs/design-system.md#sourcepanel). Replay remounts the panel: 200 ms fade, 480 ms sweep, then a 200 ms ring. Reduced motion shows the completed ink and ring immediately.',
      },
    },
  },
  args: {
    from: factSamples.money.item.from,
    when: factSamples.money.item.when,
    source: factSamples.money.fact.source,
    kind: 'money',
    onClose: fn(),
    onOpenEmail: fn(),
  },
  render: (args) => <PanelExample {...args} />,
} satisfies Meta<typeof SourcePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Time: Story = {
  args: {
    from: factSamples.time.item.from,
    when: factSamples.time.item.when,
    source: factSamples.time.fact.source,
    kind: 'time',
  },
};
export const People: Story = {
  args: {
    from: factSamples.people.item.from,
    when: factSamples.people.item.when,
    source: factSamples.people.fact.source,
    kind: 'people',
  },
};
export const Judgment: Story = {
  args: {
    from: evidence.from,
    when: evidence.when,
    source: evidence,
    kind: 'judgment',
  },
};
export const ConnectedField: Story = {
  render: () => <FieldExample sample={factSamples.money} replay />,
};
export const CloseAndReplay: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open email' }));
    await expect(args.onOpenEmail).toHaveBeenCalledOnce();
    await expect(
      canvas.getByRole('region', { name: 'Original email example' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Close source' }));
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(
      canvas.queryByRole('region', { name: 'Source from ' + args.from }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Replay source reveal' }),
    );
    const reopened = await canvas.findByRole('region', {
      name: 'Source from ' + args.from,
    });
    await waitFor(async () => {
      await expect(reopened).toBeVisible();
    });
  },
};
