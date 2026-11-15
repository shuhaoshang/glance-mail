import type { OtherMailRow as Mail } from '../../../data/types';
import type { MovedRow } from '../MailRows/movedEmail';
import { Icon } from '../Icon/Icon';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import motion from '../ListMotion.module.css';
import styles from '../MailRows/MailRows.module.css';
export interface OtherMailRowProps {
  item: Mail | MovedRow;
  selected?: boolean;
  leaving?: boolean;
  onLeaveComplete?: () => void;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}
export function OtherMailRow({
  item,
  selected = false,
  leaving = false,
  onLeaveComplete,
  onSelect,
}: OtherMailRowProps) {
  const desktop = useDesktopLayout();
  const moved = 'moved' in item;
  return (
    <div
      role="listitem"
      inert={leaving}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget)
          onLeaveComplete?.();
      }}
      className={[
        styles.row,
        motion.shell,
        leaving && motion.leaving,
        !desktop && styles.phone,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={motion.content}>
        <button
          type="button"
          data-mail-item={item.id}
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
    </div>
  );
}
