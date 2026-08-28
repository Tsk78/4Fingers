import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from '@/context/ToastContext';

/** Enqueue toasts onto the FIFO queue owned by ToastProvider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
