import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import motion from '../ListMotion.module.css';
import styles from './DoneRow.module.css';

interface DoneRowProps {
  name: string;
  note: string;
  kind?: 'done' | 'snoozed' | 'moved';
  onUndo: () => void;
}
export function DoneRow({ name, note, kind = 'done', onUndo }: DoneRowProps) {
  return (
    <div role="listitem" className={[styles.row, motion.enter].join(' ')}>
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
      <Button
        variant="text"
        size="compact"
        onClick={onUndo}
        aria-label={'Undo ' + name}
      >
        Undo
      </Button>
    </div>
  );
}
