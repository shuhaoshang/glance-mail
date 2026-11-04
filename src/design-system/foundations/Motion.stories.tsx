import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../data';
import { FoundationPage, TokenList } from './catalog';
import { tokenNames } from './tokenValues';
import styles from './Scales.module.css';

const meta = {
  title: 'Foundations/Motion',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

const uses: Record<string, string> = {
  '--duration-fast': 'Hover, selection and tabs',
  '--duration-reveal': 'Panels appear',
  '--duration-collapse': 'Done and snoozed rows collapse',
  '--duration-highlight': 'The highlighter turns on or off',
  '--duration-sweep': 'Ink sweeps across source words',
  '--ease-standard': 'Standard transitions',
  '--ease-sweep': 'Source highlighting',
};

function SourceReveal() {
  const [playback, setPlayback] = useState(0);
  const source = getPersona('sarah')
    .items.flatMap((item) => item.facts)
    .find((fact) => fact.kind === 'money')?.source;

  if (!source) return null;

  return (
    <section>
      <h2>Source reveal</h2>
      <p>
        The sentence appears first. Ink sweeps across the amount, then a ring
        frames the words.
      </p>
      <blockquote
        key={playback}
        data-playing={playback > 0}
        className={styles.excerpt}
      >
        {source.pre}
        <span className={styles.ink}>{source.hl}</span>
        {source.post}
      </blockquote>
      <button
        type="button"
        className={styles.replay}
        onClick={() => setPlayback((n) => n + 1)}
      >
        Replay source reveal
      </button>
    </section>
  );
}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Motion"
      description="Motion explains a change. Turn on reduced motion in your system settings to see the live durations shorten."
    >
      <SourceReveal />
      <section>
        <h2>Durations</h2>
        <TokenList
          names={tokenNames.filter((name) => name.startsWith('--duration-'))}
          sample={(name) => uses[name]}
        />
      </section>
      <section>
        <h2>Easing</h2>
        <TokenList
          names={tokenNames.filter((name) => name.startsWith('--ease-'))}
          sample={(name) => uses[name]}
        />
      </section>
    </FoundationPage>
  ),
};
