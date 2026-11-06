import { Text } from '../Text/Text';
import { Button } from '../Button/Button';
import styles from './SnoozeMenu.module.css';
const snoozeOptions = [
  'Later today, 3:00 PM',
  'Tomorrow, 8:00 AM',
  'Monday, 8:00 AM',
] as const;
export function SnoozeMenu({
  id,
  onChoose,
  onClose,
}: {
  id: string;
  onChoose: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <section
      id={id}
      role="group"
      aria-label="Snooze until"
      className={styles.panel}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <Text variant="meta" className={styles.title}>
        Snooze until
      </Text>
      <div className={styles.options}>
        {snoozeOptions.map((label) => (
          <Button key={label} variant="outline" onClick={() => onChoose(label)}>
            {label}
          </Button>
        ))}
      </div>
      <Text variant="meta">It comes back to Needs you at that time.</Text>
    </section>
  );
}
