import type { Ref } from 'react';
import type { FactKind } from '../../../data/types';
import { Text } from '../Text/Text';
import tones from '../factStyles.module.css';
import styles from './Field.module.css';

interface Appearance {
  label?: string;
  value: string;
  size?: 'small' | 'default' | 'large';
  selected?: boolean;
  inline?: boolean;
}

type FieldProps = Appearance &
  (
    | {
        fact: string;
        kind: FactKind;
        onSelect: (factId: string) => void;
        sourcePanelId?: string;
        ref?: Ref<HTMLButtonElement>;
      }
    | {
        fact?: undefined;
        kind?: never;
        onSelect?: never;
        sourcePanelId?: never;
        ref?: never;
      }
  );

export function Field({
  label,
  value,
  size = 'default',
  selected = false,
  inline = false,
  ref: buttonRef,
  ...source
}: FieldProps) {
  const classes = [
    styles.value,
    styles[size],
    source.fact !== undefined && styles.traceable,
    source.kind && tones[source.kind],
    source.fact !== undefined && selected && styles.selected,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={[styles.field, inline && styles.inline]
        .filter(Boolean)
        .join(' ')}
    >
      {label && <Text variant="meta">{label}</Text>}
      {source.fact !== undefined ? (
        <button
          type="button"
          ref={buttonRef}
          className={classes}
          aria-label={
            (label ? label + ': ' : '') +
            value +
            '. Show where the email says so'
          }
          aria-expanded={selected}
          aria-controls={source.sourcePanelId}
          onClick={() => source.onSelect(source.fact)}
        >
          {value}
        </button>
      ) : (
        <span className={classes}>{value}</span>
      )}
    </span>
  );
}
