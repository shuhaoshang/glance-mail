import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationPage } from '../foundations/catalog';
import { FactChip } from './FactChip/FactChip';
import { Field } from './Field/Field';
import { FieldExample, FieldStatesExample } from './FactExamples';
import { Highlight } from './Highlight/Highlight';
import { Text } from './Text/Text';
import { evidence, factSamples, plainField, urgentFact } from './factSamples';
import styles from './FactExamples.module.css';

const meta = {
  title: 'Primitives/Gallery: Facts and sources',
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    pseudo: {
      hover: '[data-field-state="Hover"] button[aria-expanded]',
      active: '[data-field-state="Pressed"] button[aria-expanded]',
      focusVisible: '[data-field-state="Focus"] button[aria-expanded]',
    },
  },
} satisfies Meta;
export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Facts and sources"
      description="Scan a fact, open its source, and verify the exact words. Examples use Maya's and Sarah's emails."
    >
      <section className={styles.sheet}>
        <h2>Fact chips</h2>
        <div className={styles.row}>
          <FactChip {...factSamples.money.fact} />
          <FactChip {...factSamples.money.item.facts[2]} />
          <FactChip {...factSamples.people.fact} />
        </div>
        <Text variant="meta">
          Urgency changes the fill; the type dot and text keep every fact
          identifiable.
        </Text>
        <FactChip {...urgentFact} />
      </section>
      <section className={styles.sheet}>
        <h2>Field states</h2>
        <FieldStatesExample sample={factSamples.money} />
        <div className={styles.row}>
          <Field {...plainField} fact={undefined} />
        </div>
      </section>
      <section className={styles.sheet}>
        <h2>Replay the source reveal</h2>
        <FieldExample sample={factSamples.time} initiallyOpen replay />
      </section>
      <section className={styles.sheet}>
        <h2>Ink across lines</h2>
        <Text variant="reading" as="p" className={styles.wrap}>
          {evidence.pre}
          <Highlight kind="judgment" selected wrap>
            {evidence.hl}
          </Highlight>
          {evidence.post}
        </Text>
      </section>
    </FoundationPage>
  ),
};
