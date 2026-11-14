import type { ReactNode } from 'react';
import type { EmailTab } from '../MailRows/movedEmail';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import {
  OtherMailRow,
  type OtherMailRowProps,
} from '../OtherMailRow/OtherMailRow';
import styles from './MailList.module.css';
interface MailListProps {
  tab: EmailTab;
  children?: ReactNode;
  empty?: boolean;
  progress?: { done: number; total: number };
  remaining?: number;
  emptyContent?: ReactNode;
}
export function MailList({
  tab,
  children,
  empty = false,
  progress,
  remaining = 0,
  emptyContent,
}: MailListProps) {
  if (empty && emptyContent) return emptyContent;
  return (
    <section aria-label={tab + ' list panel'} className={styles.panel}>
      {tab === 'Needs you' && progress && (
        <header className={styles.heading}>
          <span>By deadline, then amount</span>
          <span
            className={styles.progress}
            role="status"
            aria-label="Brief progress"
          >
            {progress.done + ' of ' + progress.total + ' done'}
            <ProgressBar
              value={progress.total ? progress.done / progress.total : 0}
            />
          </span>
        </header>
      )}
      {empty ? (
        <div className={styles.empty}>
          <strong>Nothing here.</strong>
          <p>{'Emails you move to ' + tab + ' will show up here.'}</p>
        </div>
      ) : (
        <div role="list" aria-label={tab} className={styles.rows}>
          {children}
        </div>
      )}
      {!empty && remaining > 0 && (
        <p className={styles.remaining}>{remaining + ' more like these'}</p>
      )}
    </section>
  );
}
export function OtherMailList({
  items,
  total,
  selected,
  onSelect,
  pendingId,
  onLeaveComplete,
}: {
  items: readonly OtherMailRowProps['item'][];
  total: number;
  selected?: string;
  onSelect: OtherMailRowProps['onSelect'];
  pendingId?: string;
  onLeaveComplete?: (id: string) => void;
}) {
  return (
    <MailList
      tab="Other mail"
      empty={total === 0}
      remaining={Math.max(0, total - items.length)}
    >
      {items.map((item) => (
        <OtherMailRow
          key={item.id}
          item={item}
          leaving={pendingId === item.id}
          onLeaveComplete={() => onLeaveComplete?.(item.id)}
          selected={selected === item.id}
          onSelect={onSelect}
        />
      ))}
    </MailList>
  );
}
