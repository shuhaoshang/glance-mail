import type { KeyboardEvent } from 'react';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './SegmentedControl.module.css';

export interface Segment {
  value: string;
  label: string;
  panelId?: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  'aria-label': string;
  options: readonly Segment[];
  fullWidth?: boolean;
  size?: 'default' | 'small';
  appearance?: 'segmented' | 'underline';
  value: string;
  onValueChange: (value: string) => void;
  mode?: 'tabs' | 'radio' | 'menu-radio';
}

function moveFocus(event: KeyboardEvent<HTMLDivElement>, menuRadio: boolean) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button:enabled'),
  );
  const index = tabs.indexOf(event.target as HTMLButtonElement);
  if (index < 0) return;
  let next: number;
  if (menuRadio && (event.key === 'Home' || event.key === 'End')) return;
  const radioGroup = event.currentTarget.getAttribute('role') === 'radiogroup';
  const key =
    radioGroup && event.key === 'ArrowDown'
      ? 'ArrowRight'
      : radioGroup && event.key === 'ArrowUp'
        ? 'ArrowLeft'
        : event.key;
  switch (key) {
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
  if (!menuRadio) tabs[next].click();
}

/** Each panel uses its option's panelId and aria-labelledby={panelId + '-tab'}. */
export function SegmentedControl({
  'aria-label': label,
  options,
  mode = 'tabs',
  fullWidth = false,
  value,
  onValueChange,
  size = 'default',
  appearance = 'segmented',
}: SegmentedControlProps) {
  const menuRadio = mode === 'menu-radio';
  const tabs = mode === 'tabs';
  const entry =
    options.find((option) => option.value === value && !option.disabled) ??
    options.find((option) => !option.disabled);
  return (
    <div
      role={menuRadio ? 'group' : tabs ? 'tablist' : 'radiogroup'}
      data-appearance={appearance}
      aria-label={label}
      className={[
        styles.track,
        fullWidth && styles.fullWidth,
        size === 'small' && styles.small,
        appearance === 'underline' && styles.underline,
      ]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={(event) => moveFocus(event, menuRadio)}
    >
      {options.map((option) => {
        const panelId = tabs ? option.panelId : undefined;
        return (
          <button
            key={option.value}
            type="button"
            role={menuRadio ? 'menuitemradio' : tabs ? 'tab' : 'radio'}
            id={panelId ? panelId + '-tab' : undefined}
            aria-controls={panelId}
            aria-selected={tabs ? option.value === value : undefined}
            aria-checked={tabs ? undefined : option.value === value}
            tabIndex={!menuRadio && option === entry ? 0 : -1}
            disabled={option.disabled}
            className={[control.control, hitTarget.target, styles.tab].join(
              ' ',
            )}
            onClick={() => {
              if (option.value !== value) onValueChange(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
