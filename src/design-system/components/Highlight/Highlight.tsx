import type { ReactNode } from 'react';
import type { FactKind } from '../../../data/types';
import tones from '../factStyles.module.css';
import styles from './Highlight.module.css';

export type HighlightKind = FactKind | 'judgment';

interface HighlightProps {
  children: ReactNode;
  kind: HighlightKind;
  selected?: boolean;
  animate?: boolean;
  wrap?: boolean;
}

export function Highlight({
  children,
  kind,
  selected = false,
  animate = false,
  wrap = false,
}: HighlightProps) {
  return (
    <mark
      className={[
        styles.highlight,
        tones[kind],
        selected && styles.selected,
        animate && styles.animate,
        !wrap && styles.nowrap,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </mark>
  );
}
