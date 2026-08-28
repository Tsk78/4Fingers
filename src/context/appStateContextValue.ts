import { createContext, type Dispatch } from 'react';
import type { UserState } from '@/types';
import { SCHEMA_VERSION } from '@/types';
import { storage } from '@/services/storage';
import { DEFAULT_USER_STATE, type AppAction } from './appStateReducer';

export const STORAGE_KEY = 'userState';

export interface AppStateContextValue {
  state: UserState;
  dispatch: Dispatch<AppAction>;
}

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
