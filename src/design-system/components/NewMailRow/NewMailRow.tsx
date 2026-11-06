import { Button } from '../Button/Button';
import styles from './NewMailRow.module.css';
interface NewMailRowProps {
  label: string;
  onAdd: () => void;
  added?: boolean;
}
export function NewMailRow({ label, onAdd, added }: NewMailRowProps) {
  return (
    <div role="listitem" className={styles.row}>
      <span aria-hidden="true" className={styles.dot} />
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.label}
      >
        {label}
      </span>
      {!added && (
        <Button variant="text" size="compact" onClick={onAdd}>
          Add to brief
        </Button>
      )}
    </div>
  );
}
