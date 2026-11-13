import type { KeyboardEvent } from 'react';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './TabBar.module.css';

export interface Tab {
  /** Unique ID of the tab's content panel. Label that panel with `${id}-tab`. */
  id: string;
  label: string;
  count: number;
  hasNews?: boolean;
}

interface TabBarProps {
  left: readonly Tab[];
  right?: readonly Tab[];
  selected: string;
  onSelect: (id: string) => void;
  /** Defaults to the shared responsive breakpoint. */
  mobile?: boolean;
}

function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const current = tabs.indexOf(event.target as HTMLButtonElement);
  if (current < 0) return;
  let next: number;
  switch (event.key) {
    case 'ArrowRight':
      next = (current + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      next = (current + tabs.length - 1) % tabs.length;
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

export function TabBar({
  left,
  right = [],
  selected,
  onSelect,
  mobile,
}: TabBarProps) {
  const desktop = useDesktopLayout();
  const phone = mobile ?? !desktop;
  function group(tabs: readonly Tab[], label: 'Email' | 'Glance') {
    if (!tabs.length) return null;
    const entry = tabs.find((tab) => tab.id === selected) ?? tabs[0];
    return (
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={moveFocus}
        className={[styles.group, label === 'Glance' && styles.right]
          .filter(Boolean)
          .join(' ')}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={tab.id + '-tab'}
            aria-controls={tab.id}
            aria-selected={tab.id === selected}
            aria-label={
              tab.label + ' ' + tab.count + (tab.hasNews ? ', new' : '')
            }
            tabIndex={tab === entry ? 0 : -1}
            className={[control.control, hitTarget.target, styles.tab].join(
              ' ',
            )}
            onClick={() => {
              if (tab.id !== selected) onSelect(tab.id);
            }}
          >
            <span>{tab.label}</span>
            <span className={styles.count}>{tab.count}</span>
            {tab.hasNews && <span className={styles.news} aria-hidden="true" />}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div
      className={[styles.bar, phone && styles.phone].filter(Boolean).join(' ')}
    >
      {group(left, 'Email')}
      {!phone && group(right, 'Glance')}
    </div>
  );
}
