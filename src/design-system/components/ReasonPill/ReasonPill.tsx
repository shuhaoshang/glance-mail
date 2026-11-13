import type { Ref } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './ReasonPill.module.css';

interface ReasonPillProps {
  label: string;
  size?: 'small' | 'default';
  mobile?: boolean;
  expanded?: boolean;
  controls?: string;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
}
export function ReasonPill({
  label,
  size = 'default',
  mobile = false,
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
      className={[styles.pill, styles[size], mobile && styles.mobile]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.visual}>
        <span className={styles.icon}>
          <Icon name="star" size={size === 'small' ? 'small' : 'default'} />
        </span>
        <span>{label}</span>
        <Icon
          name="chevron"
          className={[styles.chevron, expanded && styles.expanded]
            .filter(Boolean)
            .join(' ')}
        />
      </span>
    </button>
  );
}
