import { useAppStore, type AppAction, type AppState } from './index';

export function useAppDispatch(): (action: AppAction) => void {
  return (action) => {
    useAppStore.setState((state) => action(state));
  };
}

export function useAppSelector<T>(selector: (state: AppState) => T): T {
  return useAppStore(selector);
}
