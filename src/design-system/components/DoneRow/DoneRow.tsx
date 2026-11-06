import { useDesktopLayout } from '../useDesktopLayout';
import type { Ref } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import motion from '../ListMotion.module.css';
import styles from './DoneRow.module.css';

interface DoneRowProps {
  name: string;
  note: string;
  kind?: 'done' | 'snoozed' | 'moved';
  onUndo?: () => void;
  undoDisabled?: boolean;
  undoRef?: Ref<HTMLButtonElement>;
}
export function DoneRow({
  name,
  note,
  kind = 'done',
  onUndo,
  undoRef,
  undoDisabled,
}: DoneRowProps) {
  const desktop = useDesktopLayout();
  return (
    <div
      role="listitem"
      className={[
        styles.row,
        onUndo && styles.withUndo,
        !desktop && styles.phone,
        motion.enter,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon
        name={
          kind === 'done'
            ? 'check'
            : kind === 'snoozed'
              ? 'clock'
              : 'tray-arrow'
        }
        className={kind === 'done' ? styles.done : styles.muted}
      />
      <span className={styles.text}>
        <strong>{name}</strong>
        {' · ' + note}
      </span>
      {onUndo && (
        <Button
          ref={undoRef}
          disabled={undoDisabled}
          variant="text"
          size="touch"
          className={styles.undo}
          onClick={onUndo}
          aria-label={'Undo ' + name}
        >
          Undo
        </Button>
      )}
    </div>
  );
}
