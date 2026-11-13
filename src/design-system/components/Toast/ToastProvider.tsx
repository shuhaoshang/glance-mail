import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Toast, type ActiveToast, type ToastMessage } from './Toast';
import { ToastContext } from './toastContext';
const DISPLAY_TIME = 6000;
interface ToastProviderProps {
  children: ReactNode;
  initialToast?: ToastMessage;
  /** Use the open dialog as the portal target so its toast stays in the top layer. */
  container?: HTMLElement | null;
  /** The actual phone action bar, measured instead of assuming a fixed height. */
  actionBar?: HTMLElement | null;
}
export function ToastProvider({
  children,
  initialToast,
  container,
  actionBar,
}: ToastProviderProps) {
  const [toast, setToast] = useState<ActiveToast | null>(() =>
    initialToast ? { ...initialToast, id: 0 } : null,
  );
  const active = useRef(toast);
  const sequence = useRef(0);
  const preserveFocus = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(DISPLAY_TIME);
  const started = useRef(0);
  const paused = useRef({ pointer: false, focus: false });
  const stop = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - started.current),
      );
    }
  }, []);
  const dismissToast = useCallback(
    (id?: number) => {
      const message = active.current;
      if (!message || (id !== undefined && message.id !== id)) return;
      stop();
      const restore = root.current?.contains(document.activeElement);
      active.current = null;
      preserveFocus.current = false;
      setToast(null);
      if (restore && message.returnFocus?.isConnected)
        message.returnFocus.focus({ preventScroll: true });
    },
    [stop],
  );
  const start = useCallback(() => {
    if (
      !active.current ||
      timer.current !== null ||
      paused.current.pointer ||
      paused.current.focus
    )
      return;
    const id = active.current.id;
    started.current = performance.now();
    timer.current = setTimeout(() => dismissToast(id), remaining.current);
  }, [dismissToast]);
  const showToast = useCallback((message: ToastMessage) => {
    const focused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    preserveFocus.current = root.current?.contains(focused) ?? false;
    const next = {
      ...message,
      id: ++sequence.current,
      returnFocus:
        message.returnFocus === undefined
          ? preserveFocus.current
            ? (active.current?.returnFocus ?? null)
            : focused
          : message.returnFocus,
    };
    active.current = next;
    setToast(next);
    return next.id;
  }, []);
  useLayoutEffect(() => {
    stop();
    remaining.current = DISPLAY_TIME;
    if (preserveFocus.current) {
      root.current?.querySelector<HTMLButtonElement>('button')?.focus();
      preserveFocus.current = false;
    }
    paused.current = {
      pointer: root.current?.matches(':hover') ?? false,
      focus: root.current?.contains(document.activeElement) ?? false,
    };
    start();
    return stop;
  }, [toast?.id, start, stop]);
  useLayoutEffect(() => {
    stop();
    paused.current = {
      pointer: root.current?.matches(':hover') ?? false,
      focus: root.current?.contains(document.activeElement) ?? false,
    };
    start();
  }, [container, start, stop]);
  const actions = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );
  const pause = (kind: 'pointer' | 'focus', value: boolean) => {
    paused.current[kind] = value;
    if (value) stop();
    else start();
  };
  const content = (
    <Toast
      ref={root}
      message={toast}
      actionBar={actionBar}
      onDismiss={dismissToast}
      onUndo={(id) => {
        const message = active.current;
        if (message?.id !== id || !message.onUndo) return;
        dismissToast(id);
        message.onUndo();
      }}
      onPointerEnter={() => pause('pointer', true)}
      onPointerLeave={() => pause('pointer', false)}
      onFocusCapture={() => pause('focus', true)}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          pause('focus', false);
      }}
    />
  );
  return (
    <ToastContext.Provider value={actions}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(content, container ?? document.body)}
    </ToastContext.Provider>
  );
}
