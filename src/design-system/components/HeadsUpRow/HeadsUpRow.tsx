import type { Account, KnowItem } from '../../../data/types';
import type { MovedRow } from '../MailRows/movedEmail';
import { Icon } from '../Icon/Icon';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import styles from '../MailRows/MailRows.module.css';
export interface HeadsUpRowProps {
  item: KnowItem | MovedRow;
  account?: Account;
  selected?: boolean;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}
export function HeadsUpRow({
  item,
  account,
  selected = false,
  onSelect,
}: HeadsUpRowProps) {
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
        <span
          className={[styles.tile, styles[moved ? 'neutral' : item.tone]].join(
            ' ',
          )}
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
  );
}
