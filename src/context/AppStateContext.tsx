import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { UserState } from '@/types';
import { SCHEMA_VERSION } from '@/types';
import { storage } from '@/services/storage';
import { appStateReducer, DEFAULT_USER_STATE, type AppAction } from './appStateReducer';

const STORAGE_KEY = 'userState';

export interface AppStateContextValue {
  state: UserState;
  dispatch: Dispatch<AppAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppStateContext = createContext<AppStateContextValue | null>(null);

/**
 * Loads persisted state, falling back to defaults on missing data, parse
 * failure, or schema-version mismatch (Requirement 1.4, design.md §3.3).
 */
export function loadInitialState(): UserState {
  const stored = storage.get<UserState>(STORAGE_KEY);
  if (!stored || stored.schemaVersion !== SCHEMA_VERSION) {
    return DEFAULT_USER_STATE;
  }
  return stored;
}

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
