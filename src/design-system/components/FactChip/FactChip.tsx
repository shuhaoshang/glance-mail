import type { FactKind } from '../../../data/types';
import tones from '../factStyles.module.css';
import styles from './FactChip.module.css';

interface FactChipProps {
  kind: FactKind;
  label: string;
  urgent?: boolean;
}

export function FactChip({ kind, label, urgent = false }: FactChipProps) {
  return (
    <span
      className={[styles.chip, tones[kind], urgent && styles.urgent]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.srOnly}>{kind + ': '}</span>
      <span className={styles.dot} aria-hidden="true" />
      {label}
      {urgent && <span className={styles.srOnly}>, urgent</span>}
    </span>
  );
}
