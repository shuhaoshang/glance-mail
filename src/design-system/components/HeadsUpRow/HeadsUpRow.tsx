import type { Account, KnowItem } from '../../../data/types';
import type { MovedRow } from '../MailRows/movedEmail';
import { Icon } from '../Icon/Icon';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import motion from '../ListMotion.module.css';
import styles from '../MailRows/MailRows.module.css';
export interface HeadsUpRowProps {
  item: KnowItem | MovedRow;
  account?: Account;
  selected?: boolean;
  leaving?: boolean;
  onLeaveComplete?: () => void;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}
export function HeadsUpRow({
  item,
  account,
  selected = false,
  leaving = false,
  onLeaveComplete,
  onSelect,
}: HeadsUpRowProps) {
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
          <span
            className={[
              styles.tile,
              styles[moved ? 'neutral' : item.tone],
            ].join(' ')}
          >
            <Icon name={moved ? 'move' : item.icon} />
          </span>
          <span className={styles.content}>
            <span className={styles.text}>
              <strong>{item.title}</strong>
              {moved ? ': ' + item.line : item.text}
            </span>
            {account?.minority && <AccountLabel account={account} />}
            {moved && <span className={styles.moved}>Moved by you</span>}
          </span>
          <Icon name="chevron" className={styles.chevron} />
        </button>
      </div>
    </div>
  );
}
