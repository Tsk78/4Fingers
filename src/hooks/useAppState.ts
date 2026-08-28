import { useContext } from 'react';
import { AppStateContext, type AppStateContextValue } from '@/context/AppStateContext';

/** Typed accessor for shared app state with a null-check throw. */
export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (ctx === null) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}
