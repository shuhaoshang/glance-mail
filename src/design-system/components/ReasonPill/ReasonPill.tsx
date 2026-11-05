import type { Ref } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './ReasonPill.module.css';

interface ReasonPillProps {
  label: string;
  size?: 'small' | 'default';
  expanded?: boolean;
  controls?: string;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
}
export function ReasonPill({
  label,
  size = 'default',
  expanded = false,
  controls,
  onToggle,
  ref,
}: ReasonPillProps) {
  return (
    <button
      type="button"
      ref={ref}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
      className={[styles.pill, styles[size]].join(' ')}
    >
      <span className={styles.visual}>
        <Icon name="star" size={size === 'small' ? 'small' : 'default'} />
        {label}
      </span>
    </button>
  );
}
