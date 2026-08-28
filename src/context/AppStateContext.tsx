import { useEffect, useReducer, type ReactNode } from 'react';
import { storage } from '@/services/storage';
import { appStateReducer } from './appStateReducer';
import { AppStateContext, STORAGE_KEY, loadInitialState } from './appStateContextValue';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, undefined, loadInitialState);

  // Persist on every state change — the ONLY place set() is called (design.md §3.3).
  useEffect(() => {
    storage.set(STORAGE_KEY, state);
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
