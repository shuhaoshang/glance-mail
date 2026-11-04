import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationPage, TokenList } from './catalog';
import { tokenNames } from './tokenValues';
import styles from './Scales.module.css';

const meta = {
  title: 'Foundations/Spacing',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

const spaces = tokenNames.filter((name) => name.startsWith('--space-'));
const sizes = tokenNames.filter((name) => name.startsWith('--size-'));
const layout = tokenNames.filter((name) =>
  /^(--gutter$|--content-|--column-|--gap-)/.test(name),
);

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Spacing"
      description="Phone and desktop layouts share one spacing scale. Desktop layouts use larger steps for the page gutter and section gap."
    >
      <section>
        <h2>Spacing scale</h2>
        <p>
          Each bar shows four times the token width so the smaller steps are
          easier to compare.
        </p>
        <TokenList
          names={spaces}
          sample={(name) => (
            <span
              aria-hidden="true"
              className={styles.bar}
              style={{ inlineSize: `calc(var(${name}) * 4)` }}
            />
          )}
        />
      </section>
      <section>
        <h2>Fixed sizes</h2>
        <p>Each square uses the token for its width and height.</p>
        <TokenList
          names={sizes}
          sample={(name) => (
            <span
              aria-hidden="true"
              className={styles.square}
              style={{ inlineSize: `var(${name})`, blockSize: `var(${name})` }}
            />
          )}
        />
      </section>
      <section>
        <h2>Layout</h2>
        <p>
          Resize the preview to see the gutter and section gap change at the
          desktop breakpoint.
        </p>
        <TokenList names={layout} />
      </section>
    </FoundationPage>
  ),
};
