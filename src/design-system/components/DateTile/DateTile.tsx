import type { DateParts } from '../../../data/types';
import styles from './DateTile.module.css';

interface DateTileProps {
  date: Pick<DateParts, 'month' | 'day'>;
}
export function DateTile({ date }: DateTileProps) {
  return (
    <time className={styles.tile} aria-label={date.month + ' ' + date.day}>
      <span className={styles.month}>{date.month}</span>{' '}
      <span className={styles.day}>{date.day}</span>
    </time>
  );
}
