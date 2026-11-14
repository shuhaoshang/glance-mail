import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './Toast.module.css';
export interface ToastMessage {
  title: string;
  description?: string;
  onUndo?: () => void;
  returnFocus?: HTMLElement | null;
}
export interface ActiveToast extends ToastMessage {
  id: number;
}
interface ToastProps extends Pick<
  HTMLAttributes<HTMLDivElement>,
  'onPointerEnter' | 'onPointerLeave' | 'onFocusCapture' | 'onBlurCapture'
> {
  message: ActiveToast | null;
  onDismiss: (id: number) => void;
  onUndo: (id: number) => void;
  actionBar?: HTMLElement | null;
  ref?: Ref<HTMLDivElement>;
}
export function Toast({
  message,
  onDismiss,
  onUndo,
  actionBar,
  ref,
  ...events
}: ToastProps) {
  const desktop = useDesktopLayout();
  const [clearance, setClearance] = useState(0);
  useLayoutEffect(() => {
    const update = () =>
      setClearance(
        !desktop && actionBar?.isConnected
          ? Math.max(
              0,
              (actionBar.closest('dialog[open]')?.getBoundingClientRect()
                .bottom ?? window.innerHeight) -
                actionBar.getBoundingClientRect().top,
            )
          : 0,
      );
    update();
    const observer = new ResizeObserver(update);
    if (actionBar) observer.observe(actionBar);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, [actionBar, desktop]);
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      {...events}
      className={[styles.viewport, !desktop && styles.phone]
        .filter(Boolean)
        .join(' ')}
      style={{ '--toast-clearance': `${clearance}px` } as CSSProperties}
    >
      {message && (
        <div className={styles.surface}>
          <Icon name="check" className={styles.check} />
          <p className={styles.message}>
            <strong>{message.title}</strong>
            {message.description && (
              <>
                {' '}
                <span>{message.description}</span>
              </>
            )}
          </p>
          {message.onUndo && (
            <Button
              className={styles.undo}
              variant="text"
              size="compact"
              onClick={() => onUndo(message.id)}
            >
              Undo
            </Button>
          )}
          <IconButton
            className={styles.close}
            icon="close"
            size="compact"
            aria-label="Close confirmation"
            onClick={() => onDismiss(message.id)}
          />
        </div>
      )}
    </div>
  );
}
