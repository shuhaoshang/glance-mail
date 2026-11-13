import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationPage, TokenList } from './catalog';
import { tokenNames } from './tokenValues';
import styles from './Scales.module.css';

const meta = {
  title: 'Foundations/Radius',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Radius"
      description="Compare the corners used for highlights, tiles, panels, cards, sheets and pills."
    >
      <section>
        <h2>Corners</h2>
        <TokenList
          names={tokenNames.filter((name) => name.startsWith('--radius-'))}
          sample={(name) => (
            <span
              aria-hidden="true"
              className={styles.tile}
              style={{ borderRadius: `var(${name})` }}
            />
          )}
        />
      </section>
      <section>
        <h2>Borders and focus</h2>
        <p>
          Selection rings sit inside the edge, so choosing an item keeps its
          dimensions.
        </p>
        <TokenList
          names={tokenNames.filter((name) =>
            /^--(?:border-|focus-ring-)/.test(name),
          )}
          sample={(name) => (
            <span
              aria-hidden="true"
              className={styles.border}
              style={{
                boxShadow: `inset 0 0 0 var(${name}) var(--color-brand)`,
              }}
            />
          )}
        />
      </section>
      <section>
        <h2>Shadows</h2>
        <p>
          Compare the panel, selected row, selected tab, and popover shadows.
        </p>
        <TokenList
          names={tokenNames.filter((name) => name.startsWith('--shadow-'))}
          sample={(name) => (
            <span
              aria-hidden="true"
              className={styles.shadow}
              style={{ boxShadow: `var(${name})` }}
            />
          )}
        />
      </section>
    </FoundationPage>
  ),
};
