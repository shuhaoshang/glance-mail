import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from './DetailSheet.module.css';

interface DetailSheetProps {
  open: boolean;
  onClose: () => void;
  returnFocus: HTMLElement | null;
  children: ReactNode;
  label: string;
}

interface DragPoint {
  y: number;
  time: number;
}

interface DragStart {
  pointerId: number;
  y: number;
  offset: number;
  height: number;
  previous: DragPoint;
  latest: DragPoint;
  framePrevious: DragPoint;
  frameLatest: DragPoint;
}

const DISMISS_DISTANCE_RATIO = 0.25;
const DISMISS_VELOCITY_PX_PER_MS = 0.5;

function translationY(dialog: HTMLDialogElement) {
  const transform = getComputedStyle(dialog).transform;
  return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
}

function setDragOffset(dialog: HTMLDialogElement, offset: number) {
  dialog.style.setProperty('--sheet-drag-offset', `${offset}px`);
}

function returnToRest(dialog: HTMLDialogElement) {
  setDragOffset(dialog, translationY(dialog));
  dialog.dataset.dragState = 'returning';
  // Commit the dragged position before starting the return transition.
  dialog.getBoundingClientRect();
  setDragOffset(dialog, 0);
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
  const dragFrame = useRef<number | null>(null);
  const stopDragSampling = useCallback(() => {
    if (dragFrame.current !== null) cancelAnimationFrame(dragFrame.current);
    dragFrame.current = null;
  }, []);
  const sampleDragFrame = useCallback(function sampleFrame(time: number) {
    const active = drag.current;
    if (!active) {
      dragFrame.current = null;
      return;
    }
    active.framePrevious = active.frameLatest;
    active.frameLatest = {
      y: active.latest.y,
      time: Math.max(time, active.latest.time),
    };
    dragFrame.current = requestAnimationFrame(sampleFrame);
  }, []);
  const scrimPress = useRef(false);

  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    stopDragSampling();
    drag.current = null;
    scrimPress.current = false;
    if (dialog) {
      delete dialog.dataset.dragState;
      dialog.style.removeProperty('--sheet-drag-offset');
      dialog.style.removeProperty('--sheet-close-offset');
    }
    unlockScroll.current?.();
    unlockScroll.current = null;
    const target = restoreTarget.current;
    restoreTarget.current = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, [stopDragSampling]);

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
      dialog.dataset.closing = 'false';
      dialog.showModal();
      dialog
        .querySelector<HTMLElement>('[data-sheet-autofocus]')
        ?.focus({ preventScroll: true });
    } else if (!open && dialog.open && dialog.dataset.closing !== 'true') {
      // Exit from the current position, including an interrupted drag or return.
      dialog.style.setProperty(
        '--sheet-close-offset',
        `${translationY(dialog)}px`,
      );
      dialog.dataset.closing = 'true';
      stopDragSampling();
      drag.current = null;
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

    if (open && dialog.dataset.closing === 'true') {
      dialog.dataset.closing = 'false';
      delete dialog.dataset.dragState;
      dialog.style.removeProperty('--sheet-drag-offset');
      dialog.style.removeProperty('--sheet-close-offset');
    }

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      if (motion.matches && !open) finishClose();
    };
    motion.addEventListener('change', onMotionChange);
    return () => motion.removeEventListener('change', onMotionChange);
  }, [open, returnFocus, finishClose, stopDragSampling]);

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
          const dialog = dialogRef.current;
          if (!dialog || !open || !event.isPrimary || event.button !== 0)
            return;
          stopDragSampling();
          const offset = translationY(dialog);
          const point = { y: event.clientY, time: event.timeStamp };
          drag.current = {
            pointerId: event.pointerId,
            y: event.clientY,
            offset,
            height: dialog.getBoundingClientRect().height,
            previous: point,
            latest: point,
            framePrevious: point,
            frameLatest: point,
          };
          dragFrame.current = requestAnimationFrame(sampleDragFrame);
          setDragOffset(dialog, offset);
          dialog.dataset.dragState = 'dragging';
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          const dialog = dialogRef.current;
          if (!dialog || !start || start.pointerId !== event.pointerId) return;
          start.previous = start.latest;
          start.latest = { y: event.clientY, time: event.timeStamp };
          setDragOffset(
            dialog,
            Math.min(
              start.height,
              Math.max(0, start.offset + event.clientY - start.y),
            ),
          );
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          const dialog = dialogRef.current;
          if (!dialog || !start || start.pointerId !== event.pointerId) return;
          stopDragSampling();
          drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
          const offset = Math.min(
            start.height,
            Math.max(0, start.offset + event.clientY - start.y),
          );
          setDragOffset(dialog, offset);
          // Pointer-up often repeats the last coordinates. Include the preceding
          // movement segment and any release delay instead of reporting zero speed.
          const eventSample =
            event.clientY === start.latest.y ? start.previous : start.latest;
          // Frame samples also observe a held finger when the browser emits no
          // pointermove events. Use the most recent segment from either source.
          const frameSample =
            event.clientY === start.frameLatest.y
              ? start.framePrevious
              : start.frameLatest;
          const sample =
            frameSample.time > eventSample.time ? frameSample : eventSample;
          const elapsed = event.timeStamp - sample.time;
          const velocity =
            elapsed > 0 ? (event.clientY - sample.y) / elapsed : 0;
          if (
            open &&
            (offset >= start.height * DISMISS_DISTANCE_RATIO ||
              velocity > DISMISS_VELOCITY_PX_PER_MS)
          ) {
            onClose();
          } else {
            returnToRest(dialog);
          }
        }}
        onPointerCancel={(event) => {
          if (drag.current?.pointerId !== event.pointerId) return;
          stopDragSampling();
          drag.current = null;
          if (dialogRef.current) returnToRest(dialogRef.current);
        }}
        onLostPointerCapture={(event) => {
          if (drag.current?.pointerId !== event.pointerId) return;
          stopDragSampling();
          drag.current = null;
          if (dialogRef.current) returnToRest(dialogRef.current);
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
