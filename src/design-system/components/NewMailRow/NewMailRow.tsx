import { Button } from '../Button/Button';
import styles from './NewMailRow.module.css';
interface NewMailRowProps {
  label: string;
  onAdd: () => void;
}
export function NewMailRow({ label, onAdd }: NewMailRowProps) {
  return (
    <div role="listitem" className={styles.row}>
      <span aria-hidden="true" className={styles.dot} />
      <span className={styles.label}>{label}</span>
      <Button variant="text" size="compact" onClick={onAdd}>
        Add to brief
      </Button>
    </div>
  );
}
