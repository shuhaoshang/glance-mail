import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import {
  themeOptions,
  type ThemeControl,
  type ThemePreference,
} from './themeOptions';
import styles from './AccountMenu.module.css';

interface AccountMenuProps {
  name: string;
  initial: string;
  email: string;
  theme: ThemeControl;
}

export function AccountMenu({ name, initial, email, theme }: AccountMenuProps) {
  const desktop = useDesktopLayout();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();
  const identityId = id + '-identity';

  function close() {
    setOpen(false);
    // Let an in-progress browser focus change finish before returning focus.
    queueMicrotask(() => trigger.current?.focus({ preventScroll: true }));
  }

  useLayoutEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>('[role="menuitemradio"]')?.focus();

    const outside = (event: MouseEvent) =>
      event.target instanceof Node &&
      !menu.current?.contains(event.target) &&
      !trigger.current?.contains(event.target);
    const preserveFocus = (event: PointerEvent) => {
      if (outside(event)) event.preventDefault();
    };
    const dismiss = (event: MouseEvent) => {
      if (!outside(event)) return;
      event.preventDefault();
      event.stopPropagation();
      close();
    };
    document.addEventListener('pointerdown', preserveFocus, true);
    document.addEventListener('click', dismiss, true);
    return () => {
      document.removeEventListener('pointerdown', preserveFocus, true);
      document.removeEventListener('click', dismiss, true);
    };
  }, [open]);

  return (
    <div className={styles.anchor}>
      <button
        type="button"
        ref={trigger}
        aria-label={'Account for ' + name}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        className={[control.control, hitTarget.target, styles.trigger].join(
          ' ',
        )}
        onPointerDown={(event) => {
          if (open) event.preventDefault();
        }}
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {initial}
      </button>
      {open && (
        <div
          ref={menu}
          id={id}
          role="menu"
          aria-label="Account"
          aria-describedby={identityId}
          className={[styles.menu, !desktop && styles.phone]
            .filter(Boolean)
            .join(' ')}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) close();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' || event.key === 'Tab') {
              event.preventDefault();
              event.stopPropagation();
              close();
            }
          }}
        >
          <div className={styles.identity} id={identityId}>
            <Avatar initial={initial} />
            <div className={styles.details}>
              <div className={styles.name}>{name}</div>
              <div className={styles.email}>{email}</div>
            </div>
          </div>
          <div className={styles.appearance}>
            <span>Appearance</span>
            <SegmentedControl
              mode="menu-radio"
              aria-label="Appearance"
              options={themeOptions}
              size={desktop ? 'small' : 'default'}
              fullWidth={!desktop}
              value={theme.value}
              onValueChange={(value) =>
                theme.onChange(value as ThemePreference)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
