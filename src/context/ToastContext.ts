import { createContext } from 'react';

export interface ToastContextValue {
  enqueue: (text: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
