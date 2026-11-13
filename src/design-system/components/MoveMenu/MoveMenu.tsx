import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import styles from './MoveMenu.module.css';

import { destinations, type Destination } from './destinations';
export type { Destination } from './destinations';

interface MoveMenuProps {
  id: string;
  open: boolean;
  current: Destination;
  trigger: HTMLElement | null;
  /** The phone menu spans this action bar. */
  actionBar?: HTMLElement | null;
  onChoose: (destination: Destination) => void;
  onClose: () => void;
}
export function MoveMenu({
  id,
  open,
  current,
  trigger,
  actionBar,
  onChoose,
  onClose,
}: MoveMenuProps) {
  const desktop = useDesktopLayout();
  const root = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    bottom: 0,
    end: 0,
    start: 0,
    width: 0,
  });
  useLayoutEffect(() => {
    if (!open || !trigger) return;
    const update = () => {
      const anchor = trigger.getBoundingClientRect();
      const bar = (
        actionBar ??
        trigger.parentElement ??
        trigger
      ).getBoundingClientRect();
      setPosition({
        bottom:
          (trigger.closest('dialog[open]')?.getBoundingClientRect().bottom ??
            window.innerHeight) - anchor.top,
        end: window.innerWidth - anchor.right,
        start: bar.left,
        width: bar.width,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(trigger);
    if (actionBar) observer.observe(actionBar);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, trigger, actionBar, desktop]);
  useLayoutEffect(() => {
    if (open)
      root.current
        ?.querySelector<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])',
        )
        ?.focus();
  }, [open, current, trigger]);
  useLayoutEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (
        !(event.target instanceof Node) ||
        root.current?.contains(event.target) ||
        trigger?.contains(event.target)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      trigger?.focus({ preventScroll: true });
    };
    document.addEventListener('click', outside, true);
    return () => document.removeEventListener('click', outside, true);
  }, [open, trigger, onClose]);
  if (!open || !trigger) return null;
  const close = () => {
    onClose();
    trigger.focus({ preventScroll: true });
  };
  const container = trigger.closest('dialog[open]') ?? document.body;
  return createPortal(
    <div
      ref={root}
      id={id}
      role="menu"
      aria-label="Move to"
      className={[styles.menu, !desktop && styles.phone]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--move-bottom': `${position.bottom}px`,
          '--move-end': `${position.end}px`,
          '--move-start': `${position.start}px`,
          '--move-width': `${position.width}px`,
        } as CSSProperties
      }
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          close();
          return;
        }
        if (event.key === 'Tab') {
          close();
          return;
        }
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>(
            '[role="menuitem"]:not([aria-disabled="true"])',
          ),
        );
        const index = items.indexOf(event.target as HTMLButtonElement);
        let next: number;
        switch (event.key) {
          case 'ArrowDown':
            next = (index + 1) % items.length;
            break;
          case 'ArrowUp':
            next = (index + items.length - 1) % items.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = items.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        items[next].focus();
      }}
    >
      <div className={styles.heading} role="presentation">
        Move to
      </div>
      {destinations.map((destination) => (
        <button
          key={destination.id}
          type="button"
          role="menuitem"
          aria-disabled={destination.id === current || undefined}
          tabIndex={-1}
          className={[control.control, styles.item].join(' ')}
          onPointerDown={(event) => {
            if (destination.id === current) event.preventDefault();
          }}
          onClick={() => {
            if (destination.id !== current) {
              close();
              onChoose(destination.id);
            }
          }}
        >
          <span className={styles.check}>
            {destination.id === current && <Icon name="check" />}
          </span>
          <span className={styles.copy}>
            <span className={styles.label}>{destination.label}</span>
            <span className={styles.description}>
              {destination.description}
            </span>
          </span>
        </button>
      ))}
      <div className={styles.note} role="presentation">
        <Icon name="bulb" />
        <span>Glance learns from every move.</span>
      </div>
    </div>,
    container,
  );
}
