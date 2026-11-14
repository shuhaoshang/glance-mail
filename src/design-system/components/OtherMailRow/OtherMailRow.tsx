import type { OtherMailRow as Mail } from '../../../data/types';
import type { MovedRow } from '../MailRows/movedEmail';
import { Icon } from '../Icon/Icon';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import styles from '../MailRows/MailRows.module.css';
export interface OtherMailRowProps {
  item: Mail | MovedRow;
  selected?: boolean;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}
export function OtherMailRow({
  item,
  selected = false,
  onSelect,
}: OtherMailRowProps) {
  const desktop = useDesktopLayout();
  const moved = 'moved' in item;
  return (
    <div
      role="listitem"
      className={[styles.row, !desktop && styles.phone]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className={[control.control, styles.button].join(' ')}
        aria-pressed={selected}
        onClick={(event) => onSelect(item.id, event.currentTarget)}
      >
        <span className={[styles.content, styles.otherContent].join(' ')}>
          <span className={styles.heading}>
            <span className={styles.sender}>
              {moved ? item.title : item.sender}
            </span>
            {!moved && <span className={styles.when}>{item.when}</span>}
          </span>
          <span className={[styles.text, styles.subject].join(' ')}>
            {moved ? item.line : item.subject}
          </span>
          {moved ? (
            <span className={styles.moved}>Moved by you</span>
          ) : (
            <span className={styles.reason}>
              <Icon name="star" size="small" /> {item.reason}
            </span>
          )}
        </span>
        <Icon name="chevron" className={styles.chevron} />
      </button>
    </div>
  );
}
