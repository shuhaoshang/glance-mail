import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  completed?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}
export function Checkbox({
  label,
  checked,
  onCheckedChange,
  completed = false,
  disabled = false,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.root}>
      <span className={styles.hit}>
        <input
          ref={input}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : id + '-label'}
          onChange={(event) => onCheckedChange(event.currentTarget.checked)}
          className={styles.input}
        />
        <span className={styles.box} aria-hidden="true">
          {checked && <Icon name="check" />}
        </span>
      </span>
      <span
        className={[styles.labelHit, disabled && styles.disabled]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => {
          const target = event.target;
          if (
            disabled ||
            !(target instanceof Element) ||
            target.closest(
              'button, a, input, select, textarea, [role="button"], [role="link"]',
            )
          )
            return;
          input.current?.focus();
          input.current?.click();
        }}
      >
        <span
          id={id + '-label'}
          className={completed ? styles.completed : undefined}
        >
          {label}
        </span>
      </span>
    </div>
  );
}
