import { Icon } from '../Icon/Icon';
import styles from './GlanceMark.module.css';

export function GlanceMark({ showLabel = false }: { showLabel?: boolean }) {
  return (
    <span
      className={styles.mark}
      role={showLabel ? undefined : 'img'}
      aria-label={showLabel ? undefined : 'Glance’s summary'}
    >
      <Icon name="star" size="small" className={styles.star} />
      {showLabel && (
        <span>
          Glance’s summary{' '}
          <span className={styles.disclosure}>· not the sender’s words</span>
        </span>
      )}
    </span>
  );
}
