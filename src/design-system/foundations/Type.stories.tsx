import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../data';
import { Text, type TextVariant } from '../components/Text/Text';
import { FoundationPage, TokenList } from './catalog';
import { tokenNames } from './tokenValues';
import styles from './Type.module.css';

const maya = getPersona('maya');
const renewal = maya.items[0];
const deadline = renewal.facts[0];
const { pre, hl, post } = deadline.source;
const specimens = [
  { variant: 'greeting', usage: 'Morning greeting', sample: maya.greeting },
  {
    variant: 'request',
    usage: 'Request',
    sample: renewal.request.text,
  },
  { variant: 'title', usage: 'Selected item', sample: renewal.name },
  { variant: 'section', usage: 'Section heading', sample: 'Needs you' },
  {
    variant: 'body',
    usage: 'Brief coverage',
    sample: maya.coverage.text.replace('{n}', String(maya.coverage.emails)),
  },
  { variant: 'reading', usage: 'Source sentence', sample: pre + hl + post },
  {
    variant: 'meta',
    usage: 'Source details',
    sample: [renewal.from, renewal.when].join(' · '),
  },
  { variant: 'chip', usage: 'Fact label', sample: deadline.label },
] satisfies { variant: TextVariant; usage: string; sample: string }[];

const typeTokens = tokenNames.filter((name) =>
  /^--(?:font-|line-height-|letter-spacing-)/.test(name),
);

function Specimen({ variant, usage, sample }: (typeof specimens)[number]) {
  const sampleRef = useRef<HTMLElement>(null);
  const [metrics, setMetrics] = useState('');

  useEffect(() => {
    const element = sampleRef.current?.firstElementChild;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element);
      setMetrics(
        `${style.fontSize} / ${style.lineHeight} · ${style.fontWeight}`,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.row}>
      <dt className={styles.label}>
        <strong className={styles.name}>{variant}</strong>
        <span>{usage}</span>
        <span className={styles.metrics}>{metrics}</span>
      </dt>
      <dd className={styles.sample} ref={sampleRef}>
        <Text as="p" variant={variant}>
          {sample}
        </Text>
      </dd>
    </div>
  );
}

function TypePage() {
  return (
    <FoundationPage
      title="Type"
      description="Eight text styles from Maya's brief. Resize the preview to compare the phone and desktop scales."
    >
      <dl className={styles.specimens} aria-label="Text styles">
        {specimens.map((specimen) => (
          <Specimen key={specimen.variant} {...specimen} />
        ))}
      </dl>
      <h2 className={styles.heading}>Typography tokens</h2>
      <TokenList names={typeTokens} />
    </FoundationPage>
  );
}

const meta = {
  title: 'Foundations/Type',
  tags: ['!autodocs'],
  component: TypePage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypePage>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
