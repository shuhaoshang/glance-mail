import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from './DetailSheet.module.css';

interface DetailSheetProps {
  open: boolean;
  onClose: () => void;
  returnFocus: HTMLElement | null;
  children: ReactNode;
  label: string;
}

interface DragStart {
  pointerId: number;
  x: number;
  y: number;
}

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function DetailSheet({
  open,
  onClose,
  returnFocus,
  children,
  label,
}: DetailSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreTarget = useRef<HTMLElement | null>(null);
  const unlockScroll = useRef<(() => void) | null>(null);
  const drag = useRef<DragStart | null>(null);
  const scrimPress = useRef(false);

  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    unlockScroll.current?.();
    unlockScroll.current = null;
    const target = restoreTarget.current;
    restoreTarget.current = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      restoreTarget.current =
        returnFocus ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null);
      const body = dialog.ownerDocument.body;
      const previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      unlockScroll.current = () => {
        if (body.style.overflow === 'hidden')
          body.style.overflow = previousOverflow;
      };
      dialog.showModal();
      dialog
        .querySelector<HTMLElement>('[data-sheet-autofocus]')
        ?.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      const style = getComputedStyle(dialog);
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        style.animationName === 'none' ||
        style.animationDuration
          .split(',')
          .every((duration) => parseFloat(duration) === 0)
      )
        finishClose();
    }

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      if (motion.matches && !open) finishClose();
    };
    motion.addEventListener('change', onMotionChange);
    return () => motion.removeEventListener('change', onMotionChange);
  }, [open, returnFocus, finishClose]);

  useLayoutEffect(() => finishClose, [finishClose]);

  function outside(dialog: HTMLDialogElement, x: number, y: number) {
    const bounds = dialog.getBoundingClientRect();
    return (
      x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      aria-modal="true"
      className={styles.dialog}
      data-closing={!open}
      onCancel={(event) => {
        event.preventDefault();
        if (open) onClose();
      }}
      onPointerDown={(event) => {
        scrimPress.current =
          event.target === event.currentTarget &&
          outside(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (
          open &&
          scrimPress.current &&
          event.target === event.currentTarget &&
          outside(event.currentTarget, event.clientX, event.clientY)
        )
          onClose();
        scrimPress.current = false;
      }}
      onAnimationEnd={(event) => {
        if (
          !open &&
          event.target === event.currentTarget &&
          event.animationName ===
            getComputedStyle(event.currentTarget).animationName
        )
          finishClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          if (open) onClose();
          return;
        }
        if (event.key !== 'Tab') return;
        const targets = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector),
        ).filter(
          (element) =>
            element.getClientRects().length > 0 &&
            !element.closest('[hidden], [inert], [aria-hidden="true"]'),
        );
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div
        className={styles.handleTarget}
        role="separator"
        aria-label="Drag down to close detail"
        aria-orientation="horizontal"
        data-sheet-handle
        onPointerDown={(event) => {
          if (!open || !event.isPrimary || event.button !== 0) return;
          drag.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          if (!start || start.pointerId !== event.pointerId) return;
          drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
          const down = event.clientY - start.y;
          const across = Math.abs(event.clientX - start.x);
          if (open && down > 0 && down > across) onClose();
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        <span aria-hidden="true" className={styles.handle} />
      </div>
      <div className={styles.content} data-sheet-content>
        {children}
      </div>
    </dialog>
  );
}
