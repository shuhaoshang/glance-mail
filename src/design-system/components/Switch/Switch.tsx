import { useId } from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
  label: string;
  checked: boolean;
  hideLabel?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}
export function Switch({
  label,
  checked,
  hideLabel = false,
  onCheckedChange,
  disabled = false,
}: SwitchProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={[styles.root, disabled && styles.disabled]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        id={id}
        className={styles.input}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} />
      </span>
      {!hideLabel && <span>{label}</span>}
    </label>
  );
}
