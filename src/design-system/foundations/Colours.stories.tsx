import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import tokenSource from '../tokens/tokens.css?raw';
import { FoundationPage } from './catalog';
import { tokenNames, useTokenValues } from './tokenValues';
import styles from './Colours.module.css';

const colours = tokenNames.filter((name) => name.startsWith('--color-'));
// Apply the original theme rules to two local scopes so both palettes can be measured at once.
const comparisonRules = tokenSource.replaceAll(':root', '[data-colour-scope]');

const groups = [
  ['Surfaces and text', /^--color-(?:bg|surface|border|text|icon|scrim)/],
  ['Glance and urgency', /^--color-(?:brand|on-brand|urgent|on-urgent)/],
  ['Money', /^--color-money/],
  ['Time', /^--color-time/],
  ['People and judgment', /^--color-(?:people|judgment)/],
  ['Demo controls', /^--color-demo/],
] as const;

function ColourCell({ value }: { value: string }) {
  return (
    <td>
      <div className={styles.sample}>
        <span
          aria-hidden="true"
          className={styles.swatch}
          style={{ backgroundColor: value }}
        />
        <code>{value}</code>
      </div>
    </td>
  );
}

function Colours({ dark }: { dark: boolean }) {
  const lightScope = useRef<HTMLSpanElement>(null);
  const darkScope = useRef<HTMLSpanElement>(null);
  const lightValues = useTokenValues(colours, lightScope);
  const darkValues = useTokenValues(colours, darkScope);
  const current = dark ? darkValues : lightValues;
  const alternate = dark ? lightValues : darkValues;
  const sections: { label: string; names: string[] }[] = groups.map(
    ([label, match]) => ({
      label,
      names: colours.filter((name) => match.test(name)),
    }),
  );
  const other = colours.filter(
    (name) => !groups.some(([, match]) => match.test(name)),
  );
  if (other.length) sections.push({ label: 'Other colours', names: other });

  return (
    <FoundationPage
      title="Colours"
      description="Compare each colour in both themes. The current swatch follows the theme selected in the toolbar."
    >
      <style>{comparisonRules}</style>
      <span hidden ref={lightScope} data-colour-scope="" data-theme="light" />
      <span hidden ref={darkScope} data-colour-scope="" data-theme="dark" />
      {sections.map(({ label, names }) => (
        <section className={styles.panel} key={label}>
          <h2>{label}</h2>
          <table className={styles.table} aria-label={label}>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">{dark ? 'Dark' : 'Light'} · current</th>
                <th scope="col">{dark ? 'Light' : 'Dark'} · comparison</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <ColourCell value={current[name] ?? ''} />
                  <ColourCell value={alternate[name] ?? ''} />
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </FoundationPage>
  );
}

const meta = {
  title: 'Foundations/Colours',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {
  render: (_args, { globals }) => <Colours dark={globals.theme === 'dark'} />,
};
