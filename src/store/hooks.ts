import { useCallback } from 'react';

import { useAppStore, type AppAction, type AppState } from './index';

export function useAppDispatch(): (action: AppAction) => void {
  return useCallback((action: AppAction) => {
    useAppStore.setState((state) => action(state));
  }, []);
}

export function useAppSelector<T>(selector: (state: AppState) => T): T {
  return useAppStore(selector);
}
