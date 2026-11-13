import { createContext, useContext } from 'react';
import type { ToastMessage } from './Toast';
export interface ToastActions {
  showToast: (message: ToastMessage) => number;
  dismissToast: (id?: number) => void;
}
export const ToastContext = createContext<ToastActions | null>(null);
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider.');
  return context;
}
