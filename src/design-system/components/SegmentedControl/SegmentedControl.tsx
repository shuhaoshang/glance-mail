import type { KeyboardEvent } from 'react';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './SegmentedControl.module.css';

export interface Segment {
  value: string;
  label: string;
  panelId: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  'aria-label': string;
  options: readonly Segment[];
  size?: 'default' | 'small';
  appearance?: 'segmented' | 'underline';
  value: string;
  onValueChange: (value: string) => void;
}

function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:enabled',
    ),
  );
  const index = tabs.indexOf(event.target as HTMLButtonElement);
  if (index < 0) return;
  let next: number;
  switch (event.key) {
    case 'ArrowRight':
      next = (index + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      next = (index + tabs.length - 1) % tabs.length;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = tabs.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

/** Each panel uses its option's panelId and aria-labelledby={panelId + '-tab'}. */
export function SegmentedControl({
  'aria-label': label,
  options,
  value,
  onValueChange,
  size = 'default',
  appearance = 'segmented',
}: SegmentedControlProps) {
  const entry =
    options.find((option) => option.value === value && !option.disabled) ??
    options.find((option) => !option.disabled);
  return (
    <div
      role="tablist"
      data-appearance={appearance}
      aria-label={label}
      className={[
        styles.track,
        size === 'small' && styles.small,
        appearance === 'underline' && styles.underline,
      ]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={moveFocus}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          id={option.panelId + '-tab'}
          aria-controls={option.panelId}
          aria-selected={option.value === value}
          tabIndex={option === entry ? 0 : -1}
          disabled={option.disabled}
          className={[control.control, hitTarget.target, styles.tab].join(' ')}
          onClick={() => {
            if (option.value !== value) onValueChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
